import { useRef, useState, useCallback } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { GarmentOption } from "../data/catalog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

interface TryOnCameraProps {
  selectedGarment: GarmentOption | null;
}

export function TryOnCamera({ selectedGarment }: TryOnCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
        setError(null);
      }
    } catch {
      setError("Camera access denied. Please allow camera permission.");
    }
  }, []);

  const captureAndTryOn = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !selectedGarment) return;

    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const personImageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    // Fetch garment image as base64
    const garmentResponse = await fetch(selectedGarment.imageUrl);
    const garmentBlob = await garmentResponse.blob();
    const garmentDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(garmentBlob);
    });

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/try-on`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_image: personImageDataUrl,
          garment_image: garmentDataUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResultImage(data.result_image);
      } else {
        setError(data.error ?? "Try-on failed");
      }
    } catch {
      setError("Could not connect to backend. Make sure it is running.");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedGarment]);

  const reset = () => {
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Camera / Result */}
      <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden">
        {resultImage ? (
          <img src={resultImage} alt="Try-on result" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center px-4">{error}</p>
      )}

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-sm">
        {!streaming ? (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-amber-400 text-white font-medium"
          >
            <Camera className="w-4 h-4" />
            Start Camera
          </button>
        ) : resultImage ? (
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-white/10 text-white font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        ) : (
          <button
            onClick={captureAndTryOn}
            disabled={!selectedGarment || isGenerating}
            className="flex-1 py-3 rounded-full bg-amber-400 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Try-On"}
          </button>
        )}
      </div>
    </div>
  );
}
