/**
 * Constants for image upload constraints
 */
export const IMAGE_UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  MAX_FILES_PER_MESSAGE: 4,
  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
  ] as readonly string[],
  BUCKET_NAME: "chat-images",
  CACHE_CONTROL: "3600",
} as const;

/**
 * Generate a storage file path for an image
 * @param userId - User ID
 * @param conversationId - Conversation ID
 * @param messageId - Message ID
 * @param index - Image index (0-3)
 * @param extension - File extension (jpg, png)
 */
export function generateImagePath(
  userId: string,
  conversationId: string,
  messageId: string,
  index: number,
  extension: string
): string {
  return `images/${userId}/${conversationId}/${messageId}_${index}.${extension}`;
}

/**
 * Extract file path from a Supabase Storage public URL
 * @param url - Public URL from Supabase Storage
 * @returns File path or null if invalid
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlParts = url.split("/");
    const bucketIndex = urlParts.findIndex((part) => part === "chat-images");

    if (bucketIndex === -1 || bucketIndex + 1 >= urlParts.length) {
      return null;
    }

    // Get the file path after 'chat-images'
    return urlParts.slice(bucketIndex + 1).join("/");
  } catch {
    return null;
  }
}

/**
 * Check if a user owns a specific file path
 * @param filePath - Storage file path
 * @param userId - User ID to check ownership
 */
export function verifyFileOwnership(filePath: string, userId: string): boolean {
  return filePath.startsWith(`images/${userId}/`);
}

/**
 * Extract extension from filename
 * @param filename - Original filename
 * @returns File extension (without dot)
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "jpg";
}

/**
 * Generate a unique filename for storage
 * @param messageId - Message ID
 * @param index - Image index
 * @param originalFilename - Original filename to extract extension
 */
export function generateStorageFilename(
  messageId: string,
  index: number,
  originalFilename: string
): string {
  const extension = getFileExtension(originalFilename);
  return `${messageId}_${index}.${extension}`;
}
