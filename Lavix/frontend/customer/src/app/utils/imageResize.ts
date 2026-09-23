/**
 * Downscales an uploaded photo before it goes anywhere near the network.
 *
 * The live webcam capture is bounded by videoConstraints (1920x1080 ideal),
 * but a gallery upload was going out completely unresized -- a modern phone
 * camera shoots 12MP+ photos, several MB each, multiple times the pixel
 * count of a live capture. As base64 that is ~33% larger again, and both the
 * transfer and Vertex's own processing scale with it, which is what turned
 * "upload a photo" into a multi-minute wait next to a near-instant live
 * capture for the same size of result.
 *
 * Drawing through a canvas also normalizes EXIF orientation as a side
 * effect (a decoded HTMLImageElement is already upright in every current
 * browser engine), so the output needs no rotation handling of its own.
 */
export const UPLOAD_MAX_DIMENSION = 1600;
export const UPLOAD_JPEG_QUALITY = 0.85;

export function resizeImageFileToDataUrl(
  file: File,
  maxDimension = UPLOAD_MAX_DIMENSION,
  quality = UPLOAD_JPEG_QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const { width, height } = img;
        const scale = Math.min(1, maxDimension / Math.max(width, height));
        const targetW = Math.max(1, Math.round(width * scale));
        const targetH = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D canvas context unavailable");
        ctx.drawImage(img, 0, 0, targetW, targetH);

        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load the selected file as an image"));
    };
    img.src = objectUrl;
  });
}
