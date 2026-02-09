import { api } from "./api.service";

export interface SignedUrlResponse {
    signedUrl: string;
    token: string;
    path: string;
}

export class StorageService {
    /**
     * Gets a signed URL for uploading a file
     */
    async getSignedUrl(fileName: string, bucket: string = "creator-assets") {
        return api.post<any>("/storage/sign", { fileName, bucket });
    }

    /**
     * Uploads a file to a signed URL
     */
    async uploadFile(file: File, signedUrl: string) {
        const response = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to upload file to storage");
        }

        return true;
    }

    /**
     * Utility to handle the full upload flow
     */
    async upload(file: File) {
        // 1. Get signed URL
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const signResponse = await this.getSignedUrl(fileName);

        if (!signResponse.success || !signResponse.data) {
            throw new Error(signResponse.message || "Failed to get signed upload URL");
        }

        // 2. Upload to Supabase Storage (via signed URL)
        // Note: Supabase createSignedUploadUrl returns a URL that works with standard fetch
        const { signedUrl, path } = signResponse.data;
        await this.uploadFile(file, signedUrl);

        // 3. Return the public path or full URL
        // In a real app, you'd get the public URL after upload
        return path;
    }
}

export const storageService = new StorageService();
