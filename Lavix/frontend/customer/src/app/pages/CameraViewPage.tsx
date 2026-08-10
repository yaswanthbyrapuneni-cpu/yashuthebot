import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Header } from "../components/Header";

export function CameraViewPage({ category, categoryLink }: { category: string, categoryLink: string }) {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const request = () => {
      const anyEl = el as any;
      if (anyEl.requestFullscreen) return anyEl.requestFullscreen();
      if (anyEl.webkitRequestFullscreen) return anyEl.webkitRequestFullscreen();
      if (anyEl.msRequestFullscreen) return anyEl.msRequestFullscreen();
      return Promise.resolve();
    };

    request().catch(() => {});

    return () => {
      const doc: any = document;
      if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement) {
        if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        else if (doc.msExitFullscreen) doc.msExitFullscreen();
      }
    };
  }, []);

  const triggerCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        sessionStorage.setItem("tryOnCapturedFace", imageSrc);
        sessionStorage.setItem("autoOpenTryOnModal", "true");
        navigate(-2); // Go back to product page
      }
    }
  }, [webcamRef, navigate]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      triggerCapture();
    }
  }, [countdown, triggerCapture]);

  const handleStartTimer = () => {
    if (countdown === null) {
      setCountdown(3);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center w-full font-['Clash_Display',sans-serif]">
      <Header />

      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 relative">
        <div ref={containerRef} className="w-full max-w-[1200px] aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden relative border-4 border-gray-800 shadow-2xl">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "user" }}
          />

          {/* 3 Second Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none z-20">
              <div className="w-36 h-36 rounded-full bg-white/20 border-4 border-white/60 flex items-center justify-center backdrop-blur-md animate-bounce shadow-2xl">
                <span className="text-white text-7xl font-bold font-mono">
                  {countdown > 0 ? countdown : "📸"}
                </span>
              </div>
              <p className="text-white text-xl font-bold mt-4 tracking-wider uppercase animate-pulse">
                {countdown > 0 ? "Hold Still..." : "Smile! Capturing..."}
              </p>
            </div>
          )}
          
          <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center bg-gradient-to-t from-black/80 to-transparent z-20">
            <button
              onClick={handleStartTimer}
              disabled={countdown !== null}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-black font-extrabold text-sm rounded-full shadow-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <span>{countdown !== null ? `${countdown}s` : "✨ Start Virtual Try-On"}</span>
            </button>
          </div>

          <button
            onClick={() => navigate(-2)}
            className="absolute top-8 right-8 text-white bg-black/50 px-6 py-2 rounded-full hover:bg-black/70 transition-colors border border-white/20 z-10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}