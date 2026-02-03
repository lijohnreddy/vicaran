"use server";

import { createClient } from "@/lib/supabase/server";
import { IMAGE_UPLOAD_CONSTRAINTS } from "@/lib/storage-utils";
import { getCurrentUserId } from "@/lib/auth";

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  attachment?: {
    id: string;
    name: string;
    contentType: string;
    url: string;
    size: number;
    width?: number;
    height?: number;
  };
}

export interface ImageDeleteResult {
  success: boolean;
  error?: string;
}

interface ImageUrlRefreshResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a single image to Supabase Storage
 * @param formData - FormData containing the image file
 * @param conversationId - ID of the conversation
 * @param messageId - ID of the message (for organizing files)
 * @param index - Index of the image in the message (0-3)
 */
export async function uploadImageToStorage(
  formData: FormData,
  conversationId: string,
  messageId: string,
  index: number = 0
): Promise<ImageUploadResult> {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const supabase = await createClient();

    // Get the file from FormData
    const file = formData.get("file") as File;
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Validate file type
    if (!IMAGE_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Only JPEG and PNG images are supported",
      };
    }

    // Validate file size
    if (file.size > IMAGE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size must be less than ${Math.round(IMAGE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024)}MB`,
      };
    }

    // Generate file path: /images/{userId}/{conversationId}/{messageId}_{index}.{ext}
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${messageId}_${index}.${fileExtension}`;
    const filePath = `images/${userId}/${conversationId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_UPLOAD_CONSTRAINTS.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: IMAGE_UPLOAD_CONSTRAINTS.CACHE_CONTROL,
        upsert: true, // Allow overwriting existing files
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return {
        success: false,
        error: "Failed to upload image",
      };
    }

    // Create signed URL for private bucket (expires in 24 hours)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from(IMAGE_UPLOAD_CONSTRAINTS.BUCKET_NAME)
      .createSignedUrl(filePath, 24 * 60 * 60); // 24 hours

    if (urlError || !signedUrlData?.signedUrl) {
      console.error("Error creating signed URL:", urlError);
      return {
        success: false,
        error: "Failed to generate image URL",
      };
    }

    // Create attachment object
    const attachment = {
      id: crypto.randomUUID(),
      name: file.name,
      contentType: file.type,
      url: signedUrlData.signedUrl,
      size: file.size,
      // Note: Width/height could be extracted from image metadata if needed
    };

    return {
      success: true,
      url: signedUrlData.signedUrl,
      attachment,
    };
  } catch (error) {
    console.error("Upload image error:", error);
    return {
      success: false,
      error: "Unexpected error during upload",
    };
  }
}

/**
 * Refresh an expired signed URL for an image
 * @param filePath - The storage file path (extracted from the original URL)
 * @param expiresIn - URL expiration time in seconds (default: 24 hours)
 */
export async function refreshImageUrl(
  filePath: string,
  expiresIn: number = 24 * 60 * 60
): Promise<ImageUrlRefreshResult> {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const supabase = await createClient();

    // Verify user owns this file (security check)
    if (!filePath.startsWith(`images/${userId}/`)) {
      return {
        success: false,
        error: "Unauthorized to access this image",
      };
    }

    // Create new signed URL
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from(IMAGE_UPLOAD_CONSTRAINTS.BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (urlError || !signedUrlData?.signedUrl) {
      console.error("Error refreshing signed URL:", urlError);
      return {
        success: false,
        error: "Failed to refresh image URL",
      };
    }

    return {
      success: true,
      url: signedUrlData.signedUrl,
    };
  } catch (error) {
    console.error("Refresh image URL error:", error);
    return {
      success: false,
      error: "Unexpected error refreshing URL",
    };
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - Public URL of the image to delete
 */
export async function deleteImageFromStorage(
  imageUrl: string
): Promise<ImageDeleteResult> {
  try {
    // Get authenticated user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    const supabase = await createClient();

    // Extract file path from URL
    // For signed URLs, we need to extract the path differently
    let filePath: string;

    if (imageUrl.includes("/storage/v1/object/sign/")) {
      // Signed URL format: extract path between 'sign/' and '?'
      const pathMatch = imageUrl.match(/\/storage\/v1\/object\/sign\/([^?]+)/);
      if (!pathMatch) {
        return {
          success: false,
          error: "Invalid signed URL format",
        };
      }
      filePath = decodeURIComponent(pathMatch[1]);
    } else {
      // Fallback for public URLs (legacy)
      const urlParts = imageUrl.split("/");
      const bucketIndex = urlParts.findIndex(
        (part) => part === IMAGE_UPLOAD_CONSTRAINTS.BUCKET_NAME
      );

      if (bucketIndex === -1 || bucketIndex + 1 >= urlParts.length) {
        return {
          success: false,
          error: "Invalid image URL",
        };
      }

      filePath = urlParts.slice(bucketIndex + 1).join("/");
    }

    // Verify user owns this file (security check)
    if (!filePath.startsWith(`images/${userId}/`)) {
      return {
        success: false,
        error: "Unauthorized to delete this image",
      };
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(IMAGE_UPLOAD_CONSTRAINTS.BUCKET_NAME)
      .remove([filePath]);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return {
        success: false,
        error: "Failed to delete image",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete image error:", error);
    return {
      success: false,
      error: "Unexpected error during deletion",
    };
  }
}

/**
 * Delete multiple images from storage (batch operation)
 * @param imageUrls - Array of image URLs to delete
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<{
  success: boolean;
  deletedCount: number;
  errors: string[];
}> {
  const results = await Promise.allSettled(
    imageUrls.map((url) => deleteImageFromStorage(url))
  );

  let deletedCount = 0;
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value.success) {
      deletedCount++;
    } else {
      const error =
        result.status === "fulfilled"
          ? result.value.error || "Unknown error"
          : result.reason?.message || "Promise rejected";
      errors.push(`Image ${index + 1}: ${error}`);
    }
  });

  return {
    success: deletedCount === imageUrls.length,
    deletedCount,
    errors,
  };
}

/**
 * Validate an image file on the server
 * @param file - File to validate
 */
export async function validateImageFile(file: File): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: "No file provided",
    };
  }

  // Check file type
  if (!IMAGE_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG and PNG images are supported",
    };
  }

  // Check file size
  if (file.size > IMAGE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(IMAGE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / 1024 / 1024)}MB`,
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: "File appears to be empty",
    };
  }

  return { valid: true };
}
