import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadDetector, runDetection } from "../detectors/DetectorManager";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

// Served from this VM (same file as the marketing hero, already remuxed with
// faststart so it streams instead of downloading in full first). The GCS copy
// lives in a different GCP account we cannot write to, so it stays unfixed.
const GCP_VIDEO_URL = "/intro.mp4";
const INACTIVITY_TIMEOUT = 30_000;

export function IdleDetector() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdVisible, setIsAdVisible] = useState(false);

  const cameraRef    = useRef<HTMLVideoElement>(null);
  const adVideoRef   = useRef<HTMLVideoElement>(null);
  const streamRef    = useRef<MediaStream | null>(null);
  const rafRef       = useRef<number>(0);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef   = useRef(true);
  const adVisibleRef = useRef(false);

  useEffect(() => { adVisibleRef.current = isAdVisible; }, [isAdVisible]);

  const excluded = location.pathname.includes("/camera") ||
                   location.pathname.includes("/admin");

  // ── CAMERA + DETECTION ──────────────────────────────────────────────────
  useEffect(() => {
    if (excluded) return;
    mountedRef.current = true;
    loadDetector("face")
      .then(() => { if (mountedRef.current) initCamera(); })
      .catch(err => console.error("[IdleDetector] detector load failed:", err));
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [excluded]);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });
      if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        await cameraRef.current.play();
        if (cameraRef.current.readyState >= 2) startDetection();
        else cameraRef.current.onloadeddata = () => startDetection();
      }
    } catch (err) {
      console.error("[IdleDetector] camera access failed:", err);
    }
  };

  const startDetection = () => {
    const detect = () => {
      if (!cameraRef.current || !mountedRef.current) return;
      try {
        const result = runDetection("face", cameraRef.current) as FaceLandmarkerResult;
        if (result?.faceLandmarks?.length > 0) {
          if (adVisibleRef.current) {
            adVisibleRef.current = false;
            setIsAdVisible(false);
            document.body.style.cursor = "default";
            navigate("/home");
          }
          if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
        } else {
          if (!timerRef.current && !adVisibleRef.current) {
            timerRef.current = setTimeout(() => {
              if (!mountedRef.current) return;
              navigate("/home");
              setIsAdVisible(true);
              adVisibleRef.current = true;
              document.body.style.cursor = "none";
            }, INACTIVITY_TIMEOUT);
          }
        }
      } catch (_) {}
      rafRef.current = requestAnimationFrame(detect);
    };
    detect();
  };

  const cleanup = () => {
    cancelAnimationFrame(rafRef.current);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (cameraRef.current) cameraRef.current.srcObject = null;
    document.body.style.cursor = "default";
  };

  // ── AD VIDEO CONTROL ─────────────────────────────────────────────────────
  const playAdVideo = () => {
    const vid = adVideoRef.current;
    if (!vid || !adVisibleRef.current) return;
    vid.muted = false;
    vid.volume = 0.8;
    vid.play().catch(() => {
      vid.muted = true;
      vid.play().catch(() => {});
    });
  };

  useEffect(() => {
    const vid = adVideoRef.current;
    if (!vid) return;
    if (isAdVisible) {
      vid.currentTime = 0;
      playAdVideo();
    } else {
      vid.pause();
      vid.muted = true;
    }
  }, [isAdVisible]);

  if (excluded) return null;

  return (
    <>
      {/* Hidden camera feed for detection */}
      <video ref={cameraRef} className="hidden" playsInline muted />

      {/* Full-screen idle overlay */}
      <div
        className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500
          ${isAdVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ height: "100dvh" }}
      >
        <video
          ref={adVideoRef}
          src={GCP_VIDEO_URL}
          poster={`${import.meta.env.BASE_URL}ad-poster.jpg`}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loop
          playsInline
          muted
          onEnded={() => {
            // Fallback: force restart if browser skips the loop on large files
            if (adVisibleRef.current) playAdVideo();
          }}
        />
      </div>
    </>
  );
}
