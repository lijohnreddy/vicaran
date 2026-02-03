import { createClient } from "@/lib/supabase/server";

/**
 * Get a signed URL for a file from Supabase Storage (for private buckets)
 * @param filePath - File path in storage
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  // Import locally to avoid server/client boundary violations
  const { IMAGE_UPLOAD_CONSTRAINTS } = await import("./storage-utils");

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from(IMAGE_UPLOAD_CONSTRAINTS.BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data?.signedUrl || null;
  } catch (error) {
    console.error("Unexpected error creating signed URL:", error);
    return null;
  }
}

/**
 * Get the public URL for a file from Supabase Storage (for public buckets only)
 * @param filePath - File path in storage
 * @deprecated Use getSignedUrl for private buckets
 */
export async function getPublicUrl(filePath: string): Promise<string | null> {
  // Import locally to avoid server/client boundary violations
  const { IMAGE_UPLOAD_CONSTRAINTS } = await import("./storage-utils");

  try {
    const supabase = await createClient();

    const { data } = supabase.storage
      .from(IMAGE_UPLOAD_CONSTRAINTS.BUCKET_NAME)
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch {
    return null;
  }
}

// Re-export the constants and utility functions for backward compatibility
export {
  IMAGE_UPLOAD_CONSTRAINTS,
  generateImagePath,
  extractFilePathFromUrl,
  verifyFileOwnership,
  getFileExtension,
  generateStorageFilename,
} from "@/lib/storage-utils";
