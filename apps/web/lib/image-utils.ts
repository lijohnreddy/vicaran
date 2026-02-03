/**
 * Client-side image utilities for validation, processing, and UI helpers
 */

import { IMAGE_UPLOAD_CONSTRAINTS } from "@/lib/storage-utils";

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface ImagePreview {
  id: string;
  file: File;
  preview: string;
  size: number;
  name: string;
  type: string;
}

/**
 * Validate an image file for upload
 * @param file - File to validate
 */
export function validateImageFile(file: File): ImageValidationResult {
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
      error: `File size must be less than ${formatFileSize(IMAGE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE)}`,
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

/**
 * Validate multiple image files
 * @param files - FileList or File array to validate
 */
export function validateImageFiles(files: FileList | File[]): {
  valid: File[];
  invalid: { file: File; error: string }[];
} {
  const fileArray = Array.from(files);
  const valid: File[] = [];
  const invalid: { file: File; error: string }[] = [];

  // Check total count
  if (fileArray.length > IMAGE_UPLOAD_CONSTRAINTS.MAX_FILES_PER_MESSAGE) {
    // Return error for all files if too many
    fileArray.forEach((file) => {
      invalid.push({
        file,
        error: `Maximum ${IMAGE_UPLOAD_CONSTRAINTS.MAX_FILES_PER_MESSAGE} images allowed per message`,
      });
    });
    return { valid, invalid };
  }

  // Validate each file
  fileArray.forEach((file) => {
    const result = validateImageFile(file);
    if (result.valid) {
      valid.push(file);
    } else {
      invalid.push({ file, error: result.error || "Invalid file" });
    }
  });

  return { valid, invalid };
}

/**
 * Create image preview objects for UI display
 * @param files - Valid image files
 */
export function createImagePreviews(files: File[]): Promise<ImagePreview[]> {
  // Check if we're in a browser environment
  if (typeof FileReader === "undefined") {
    return Promise.reject(
      new Error("File reading is only available in the browser")
    );
  }

  return Promise.all(
    files.map(
      (file) =>
        new Promise<ImagePreview>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: crypto.randomUUID(),
              file,
              preview: e.target?.result as string,
              size: file.size,
              name: file.name,
              type: file.type,
            });
          };
          reader.readAsDataURL(file);
        })
    )
  );
}

/**
 * Format file size in human readable format
 * @param bytes - File size in bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Check if file type is supported
 * @param type - MIME type to check
 */
export function isSupportedImageType(type: string): boolean {
  return IMAGE_UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(type);
}

/**
 * Get image file icon based on type
 * @param type - MIME type
 */
export function getImageTypeIcon(type: string): string {
  switch (type) {
    case "image/jpeg":
    case "image/jpg":
      return "🖼️";
    case "image/png":
      return "🖼️";
    default:
      return "📄";
  }
}

/**
 * Generate a display name for an image
 * @param file - Image file
 * @param maxLength - Maximum length for the name
 */
export function generateImageDisplayName(
  file: File,
  maxLength: number = 20
): string {
  if (file.name.length <= maxLength) {
    return file.name;
  }

  const extension = file.name.split(".").pop() || "";
  const nameWithoutExt = file.name.slice(0, -(extension.length + 1));
  const truncatedName = nameWithoutExt.slice(
    0,
    maxLength - extension.length - 4
  );

  return `${truncatedName}...${extension}`;
}

/**
 * Create a FormData object for image upload
 * @param file - Image file to upload
 * @param additionalData - Additional form fields
 */
export function createImageFormData(
  file: File,
  additionalData?: Record<string, string>
): FormData {
  const formData = new FormData();
  formData.append("file", file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return formData;
}

/**
 * Check if the browser supports drag and drop for files
 * Returns false during SSR to prevent server-side errors
 */
export function isDragAndDropSupported(): boolean {
  // Return false during server-side rendering
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }

  const div = document.createElement("div");
  return (
    ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
    "FormData" in window &&
    "FileReader" in window
  );
}

/**
 * Prevent default drag behavior on an element
 * @param e - Drag event or React drag event
 */
export function preventDefaults(e: Event | React.DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Get image dimensions from file
 * @param file - Image file
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || typeof URL === "undefined") {
      reject(
        new Error("Image dimension detection is only available in the browser")
      );
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Compress an image file (basic implementation)
 * @param file - Image file to compress
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @param quality - JPEG quality (0-1)
 */
export function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Check if we're in a browser environment
    if (typeof document === "undefined") {
      reject(new Error("Image compression is only available in the browser"));
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Canvas not supported"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        file.type,
        quality
      );

      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = URL.createObjectURL(file);
  });
}
