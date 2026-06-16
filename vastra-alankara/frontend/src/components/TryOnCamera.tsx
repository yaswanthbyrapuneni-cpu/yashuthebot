import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, Zap, RefreshCw, Download } from "lucide-react";
import { GarmentOption } from "../data/catalog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

interface TryOnCameraProps {
  selectedGarment: GarmentOption | null;
}

export function TryOnCamera({ selectedGarment }: TryOnCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [streaming, setStreaming] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
      setError(null);
    } catch {
      setError("Camera access denied. Please allow camera permission and refresh.");
    }
  }, []);

  // Wait until video has a real frame (not black)
  const waitForGoodFrame = (video: HTMLVideoElement): Promise<void> =>
    new Promise((resolve) => {
      const check = () => {
        if (video.readyState >= 2 && video.videoWidth > 0) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });

  const generateTryOn = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !selectedGarment) return;

    setIsGenerating(true);
    setError(null);

    try {
      const video = videoRef.current;

      // Wait for a real frame
      await waitForGoodFrame(video);

      // Capture frame from live feed
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      const personImageDataUrl = canvas.toDataURL("image/jpeg", 0.92);

      // Fetch garment image as base64
      const garmentResponse = await fetch(selectedGarment.imageUrl);
      if (!garmentResponse.ok) throw new Error("Could not load garment image");
      const garmentBlob = await garmentResponse.blob();
      const garmentDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(garmentBlob);
      });

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
        setError(data.error ?? "Try-on failed. Please try again.");
      }
    } catch {
      setError("Could not connect to backend. Make sure it is running on port 5000.");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedGarment]);

  const tryAgain = () => {
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      {/* Display area */}
      <div className="relative w-full aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden">
        {/* Live camera — always rendered so stream stays active */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${resultImage ? "hidden" : "block"}`}
        />

        {/* Result overlay */}
        {resultImage && (
          <img src={resultImage} alt="Try-on result" className="w-full h-full object-cover" />
        )}

        {/* Idle placeholder */}
        {!streaming && !resultImage && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
            Camera preview
          </div>
        )}

        {/* Generating overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Generating try-on...</p>
          </div>
        )}

        {resultImage && (
          <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs px-3 py-1 rounded-full font-medium">
            Try-on result
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {error && <p className="text-red-400 text-sm text-center px-2">{error}</p>}

      {/* Controls */}
      <div className="flex gap-3 w-full">
        {!streaming && !resultImage && (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-amber-400 text-white font-medium"
          >
            <Camera className="w-4 h-4" />
            Start Camera
          </button>
        )}

        {streaming && !resultImage && (
          <button
            onClick={generateTryOn}
            disabled={!selectedGarment || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-amber-400 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Generate Try-On"}
          </button>
        )}

        {resultImage && (
          <>
            <button
              onClick={tryAgain}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-white/10 text-white font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = resultImage;
                a.download = `vastra-tryon-${Date.now()}.png`;
                a.click();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-amber-400 text-white font-medium"
            >
              <Download className="w-4 h-4" />
              Save Look
            </button>
          </>
        )}
      </div>
    </div>
  );
}
