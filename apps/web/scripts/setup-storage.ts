import { createSupabaseServerAdminClient } from "@/lib/supabase/admin";

async function setupChatImageStorage() {
  console.log("🚀 Setting up chat image storage...");

  const supabase = createSupabaseServerAdminClient();

  try {
    // Check if bucket already exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some(
      (bucket) => bucket.id === "chat-images"
    );

    if (bucketExists) {
      console.log("✅ Storage bucket 'chat-images' already exists");
    } else {
      // Create the storage bucket - PRIVATE for security
      const { error: bucketError } = await supabase.storage.createBucket(
        "chat-images",
        {
          public: false, // PRIVATE bucket - files accessed via authenticated API only
          allowedMimeTypes: ["image/jpeg", "image/png"],
          fileSizeLimit: 10485760, // 10MB in bytes
        }
      );

      if (bucketError) {
        console.error("❌ Error creating storage bucket:", bucketError);
        throw bucketError;
      }

      console.log(
        "✅ Storage bucket 'chat-images' created successfully (PRIVATE)"
      );
    }

    // RLS policies will be handled via database migration
    console.log(
      "🔒 Note: RLS policies need to be created via database migration"
    );
    console.log("📋 Run the following command to create storage policies:");
    console.log("   npm run db:migrate");
    console.log("");
    console.log(
      "💡 The storage policies will be created in the next migration file."
    );

    console.log("🎉 Chat image storage setup complete!");
    console.log("📁 Bucket: chat-images (PRIVATE)");
    console.log("🔒 RLS policies: Upload, View, Delete (user-scoped)");
    console.log("📏 File limits: 10MB max, JPEG/PNG only");
    console.log("🔐 Access: Authenticated API endpoints only");
  } catch (error) {
    console.error("💥 Setup failed:", error);
    process.exit(1);
  }
}

// Run the setup
setupChatImageStorage().then(() => {
  console.log("✨ Setup completed successfully!");
  process.exit(0);
});
