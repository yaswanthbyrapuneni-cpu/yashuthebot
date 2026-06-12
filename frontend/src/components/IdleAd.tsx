import { useState, useEffect, useRef, useCallback } from "react";
import { loadDetector, runDetection } from "../detectors/DetectorManager";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import clsx from "clsx";

interface IdleAdProps {
  inactivityTimeout?: number; // 30 sec default
}

export function IdleAd({
  inactivityTimeout = 30000,
}: IdleAdProps) {
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionRef = useRef<number>(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // YouTube video id
  const VIDEO_ID = "QKk9LspUkjQ"; // keep the video id here
  const PLAYER_DIV_ID = "idle-ad-yt-player";

  // Player ref (will be YT.Player instance once ready)
  const playerRef = useRef<any>(null);
  const ytApiReadyRef = useRef<boolean>(false);

  useEffect(() => {
    // Load face detector
    loadDetector("face")
      .then(() => mountedRef.current && initCamera())
      .catch((err) => {
        if (!mountedRef.current) return;
        console.error("Detector failed:", err);
        setCameraError(err.message);
      });

    return () => {
      mountedRef.current = false;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Camera init ---
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        if (videoRef.current.readyState >= 2) startDetection();
        else videoRef.current.onloadeddata = () => startDetection();
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setCameraError(err.message || "Camera access failed");
      }
    }
  };

  // --- Detection loop ---
  const startDetection = () => {
    const detect = async () => {
      if (!videoRef.current || !mountedRef.current) return;

      try {
        const result = runDetection("face", videoRef.current) as FaceLandmarkerResult;

        if (result?.faceLandmarks?.length > 0) {
          // PERSON FOUND → STOP ADS
          setIsAdVisible(false);
          document.body.style.cursor = "default";

          if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
          }
        } else {
          // PERSON NOT FOUND → START INACTIVITY TIMER
          if (!inactivityTimerRef.current && !isAdVisible) {
            inactivityTimerRef.current = setTimeout(() => {
              if (mountedRef.current) {
                setIsAdVisible(true);
                document.body.style.cursor = "none";
              }
            }, inactivityTimeout);
          }
        }
      } catch (e) {
        console.error("Detection error:", e);
      }

      detectionRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const cleanup = () => {
    if (detectionRef.current) cancelAnimationFrame(detectionRef.current);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    if (videoRef.current) videoRef.current.srcObject = null;

    // destroy YT player if exists
    try {
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
    } catch (e) {
      // ignore
    }

    document.body.style.cursor = "default";
  };

  // -----------------------------
  // YouTube IFrame API handling
  // -----------------------------
  // Load YT API script if not loaded
  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      ytApiReadyRef.current = true;
      createPlayer();
      return;
    }

    // If script already added but api not ready, attach onYouTubeIframeAPIReady handler
    if (!(window as any).onYouTubeIframeAPIReady) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    // attach the global callback
    (window as any).onYouTubeIframeAPIReady = () => {
      ytApiReadyRef.current = true;
      createPlayer();
    };

    // cleanup: remove global callback when unmount
    return () => {
      try {
        delete (window as any).onYouTubeIframeAPIReady;
      } catch (_) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create player (div with id PLAYER_DIV_ID must exist in DOM)
  const createPlayer = useCallback(() => {
    if (!ytApiReadyRef.current) return;
    if (playerRef.current) return; // already created

    const YT = (window as any).YT;
    if (!YT || !YT.Player) return;

    playerRef.current = new YT.Player(PLAYER_DIV_ID, {
      height: "720",
      width: "1280",
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        controls: 0,
        mute: 1, // start muted
        loop: 1,
        playlist: VIDEO_ID,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        // enablejsapi not needed here — using YT.Player
      },
      events: {
        onReady: (event: any) => {
          // ensure it's muted and playing
          try {
            event.target.mute();
            event.target.playVideo();
          } catch (e) {
            // ignore
          }
        },
        onError: (err: any) => {
          console.error("YT Player error:", err);
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enable audio after user tap
  const handleEnableAudio = () => {
    setIsAudioEnabled(true);
    // Unmute and play
    if (playerRef.current && typeof playerRef.current.unMute === "function") {
      try {
        playerRef.current.unMute();
        playerRef.current.playVideo();
      } catch (e) {
        console.error("Failed to unmute/play via player API:", e);
        // fallback: replace iframe src with embed that has &mute=0 (not ideal cross-origin)
        // But with YT.Player this should normally work.
      }
    } else {
      // If player not ready, try to create it (it should be ready though)
      createPlayer();
      setTimeout(() => {
        if (playerRef.current && typeof playerRef.current.unMute === "function") {
          try {
            playerRef.current.unMute();
            playerRef.current.playVideo();
          } catch (e) {
            console.error("Fallback unmute/play failed:", e);
          }
        }
      }, 500);
    }
  };

  // If ad is hidden, keep audio off in background
  useEffect(() => {
    if (!isAdVisible) {
      setIsAudioEnabled(false);
      if (playerRef.current && typeof playerRef.current.mute === "function") {
        try {
          playerRef.current.mute();
        } catch (e) {}
      }
    } else {
      // when ad becomes visible, ensure player created
      createPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdVisible]);

  if (cameraError) {
    return (
      <div className="fixed inset-0 bg-black/80 text-white flex items-center justify-center z-[99999]">
        <p>{cameraError}</p>
      </div>
    );
  }

  return (
    <>
      {/* hidden camera stream */}
      <video ref={videoRef} className="hidden" playsInline muted />

      {/* AD OVERLAY */}
      <div
        className={clsx(
          "fixed inset-0 z-[9999] bg-black transition-all duration-500 flex items-center justify-center",
          isAdVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* The YT player will be injected into this div by the IFrame API */}
        <div
          id={PLAYER_DIV_ID}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />

        {/* Tap-to-audio button (shows only when audio not enabled) */}
        {isAdVisible && !isAudioEnabled && (
          <button
            onClick={handleEnableAudio}
            className="z-[99999] absolute bottom-8 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-2xl bg-white/90 text-black font-semibold shadow-lg"
            aria-label="Enable audio"
          >
            Tap to enable audio
          </button>
        )}

        {/* Optional: small mute/unmute toggle after audio enabled */}
        {isAdVisible && isAudioEnabled && (
          <button
            onClick={() => {
              if (!playerRef.current) return;
              try {
                const isMuted =
                  typeof playerRef.current.isMuted === "function" && playerRef.current.isMuted();
                if (isMuted) {
                  playerRef.current.unMute();
                } else {
                  playerRef.current.mute();
                }
              } catch (e) {
                console.error("toggle mute failed:", e);
              }
            }}
            className="z-[99999] absolute bottom-8 right-8 px-3 py-2 rounded-lg bg-white/90 text-black font-medium shadow-md"
            aria-label="Toggle mute"
          >
            Toggle sound
          </button>
        )}
      </div>
    </>
  );
}