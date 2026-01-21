import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

class StorageService {
  private client: SupabaseClient | null = null;

  constructor() {
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      this.client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    }
  }

  async getUploadUrl(fileName: string, bucket = "designs") {
    if (!this.client) {
      return {
        signedUrl: `https://mock.printeast.com/upload/${Date.now()}-${fileName}`,
        publicUrl: `https://mock.printeast.com/public/${fileName}`,
      };
    }

    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUploadUrl(`${Date.now()}-${fileName}`);

    if (error) throw error;

    return {
      signedUrl: data.signedUrl,
      publicUrl: `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`,
    };
  }
}

export const storageService = new StorageService();
