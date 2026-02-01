import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const supabase = createClient(env.SUPABASE_URL || "", env.SUPABASE_ANON_KEY || "");

export class StorageService {
    /**
     * Generates a signed URL for uploading a file to Supabase storage.
     * Defaults to 'creator-assets' bucket.
     */
    async getUploadUrl(fileName: string, bucket: string = "creator-assets") {
        // We can use createSignedUploadUrl or just simple signing if using RLS
        // For now, let's use the simplest approach for Phase 0
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(fileName, 3600); // 1 hour expiry

        if (error) throw error;
        return data;
    }

    /**
     * Gets a public URL for a file.
     */
    getPublicUrl(path: string, bucket: string = "creator-assets") {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }
}

export const storageService = new StorageService();
