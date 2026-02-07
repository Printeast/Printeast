/**
 * Compresses a base64 string image using standard HTML Canvas API.
 * Converts to JPEG format with specified quality and max dimensions.
 * Handles transparency by flattening against a white background.
 */
export async function compressDesignPreview(base64Str: string, quality: number = 0.7, maxWidth: number = 1000): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // Maintain aspect ratio while resizing
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(base64Str); // Fail safe return original
                return;
            }

            // Fill white background to prevent black artifacts on transparent areas
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);

            // Draw image on top
            ctx.drawImage(img, 0, 0, width, height);

            // Export as JPEG with compression
            const compressed = canvas.toDataURL("image/jpeg", quality);
            resolve(compressed);
        };

        img.onerror = (err) => {
            console.error("Image compression error:", err);
            resolve(base64Str); // Fail safe return original
        };
    });
}
