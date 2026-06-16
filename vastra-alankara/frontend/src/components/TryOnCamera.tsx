import { useRef, useState, useCallback } from "react";
import { Camera, Zap, RefreshCw, X } from "lucide-react";
import { GarmentOption } from "../data/catalog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

interface TryOnCameraProps {
  selectedGarment: GarmentOption | null;
}

type Step = "idle" | "streaming" | "captured" | "result";

export function TryOnCamera({ selectedGarment }: TryOnCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<Step>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setStep("streaming");
      setError(null);
    } catch {
      setError("Camera access denied. Please allow camera permission and refresh.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("Camera not ready yet. Wait a moment and try again.");
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    // Check if frame is not black (sum of first few pixels)
    const imageData = canvas.getContext("2d")?.getImageData(0, 0, 100, 100);
    const sum = imageData ? Array.from(imageData.data).reduce((a, b) => a + b, 0) : 0;
    if (sum < 1000) {
      setError("Captured a black frame. Make sure the camera is working and try again.");
      return;
    }

    setCapturedImage(dataUrl);
    setStep("captured");
    setError(null);
    // Keep camera stream alive for retake
  }, []);

  const generateTryOn = useCallback(async () => {
    if (!capturedImage || !selectedGarment) return;

    setIsGenerating(true);
    setError(null);

    try {
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
          person_image: capturedImage,
          garment_image: garmentDataUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResultImage(data.result_image);
        setStep("result");
      } else {
        setError(data.error ?? "Try-on failed. Please try again.");
      }
    } catch {
      setError("Could not connect to backend. Make sure it is running on port 5000.");
    } finally {
      setIsGenerating(false);
    }
  }, [capturedImage, selectedGarment]);

  const reset = () => {
    setCapturedImage(null);
    setResultImage(null);
    setError(null);
    // If camera is still alive go back to streaming, else idle
    if (streamRef.current?.active) {
      setStep("streaming");
    } else {
      setStep("idle");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      {/* Display area */}
      <div className="relative w-full aspect-[3/4] bg-gray-900 rounded-2xl overflow-hidden">
        {/* Live camera */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${step === "streaming" ? "block" : "hidden"}`}
        />

        {/* Captured photo preview */}
        {step === "captured" && capturedImage && (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        )}

        {/* Result */}
        {step === "result" && resultImage && (
          <img src={resultImage} alt="Try-on result" className="w-full h-full object-cover" />
        )}

        {/* Idle placeholder */}
        {step === "idle" && (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
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

        {/* Step badge */}
        {step === "result" && (
          <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs px-3 py-1 rounded-full font-medium">
            Try-on result
          </div>
        )}
        {step === "captured" && (
          <div className="absolute top-3 left-3 bg-white/20 text-white text-xs px-3 py-1 rounded-full">
            Photo captured
          </div>
        )}

        {/* Reset button */}
        {step !== "idle" && step !== "streaming" && (
          <button
            onClick={reset}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {error && <p className="text-red-400 text-sm text-center px-2">{error}</p>}

      {/* Controls */}
      <div className="flex gap-3 w-full">
        {step === "idle" && (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-amber-400 text-white font-medium"
          >
            <Camera className="w-4 h-4" />
            Start Camera
          </button>
        )}

        {step === "streaming" && (
          <button
            onClick={capturePhoto}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-white text-gray-900 font-medium"
          >
            <Camera className="w-4 h-4" />
            Capture Photo
          </button>
        )}

        {step === "captured" && (
          <>
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 text-white/70 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>
            <button
              onClick={generateTryOn}
              disabled={!selectedGarment || isGenerating}
              className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-full bg-amber-400 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              {isGenerating ? "Generating..." : "Generate Try-On"}
            </button>
          </>
        )}

        {step === "result" && (
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-white/10 text-white font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
