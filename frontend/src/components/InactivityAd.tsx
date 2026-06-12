import { useState, useEffect, useRef } from 'react';
import { loadDetector, runDetection } from '../detectors/DetectorManager';
import { FaceLandmarkerResult } from '@mediapipe/tasks-vision';

interface InactivityAdProps {
  images: string[];
  imageInterval?: number; // Time between image changes in ms
  inactivityTime?: number; // Time before showing ads in ms
}

export function InactivityAd({ 
  images, 
  imageInterval = 5000, 
  inactivityTime = 30000 
}: InactivityAdProps) {
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionRef = useRef<number>(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  
  // Load face detector on mount
  useEffect(() => {
    loadDetector('face')
      .then(() => {
        if (mountedRef.current) {
          initCamera();
        }
      })
      .catch(error => {
        if (mountedRef.current) {
          setCameraError(`Failed to load face detection: ${error.message}`);
        }
      });
      
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []);

  // Handle image rotation when ad is visible
  useEffect(() => {
    if (isAdVisible) {
      imageIntervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, imageInterval);

      return () => {
        if (imageIntervalRef.current) {
          clearInterval(imageIntervalRef.current);
        }
      };
    }
  }, [isAdVisible, images.length, imageInterval]);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        }
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasCamera(true);
        startDetection();
      }
    } catch (err) {
      if (mountedRef.current) {
        setCameraError(err instanceof Error ? err.message : "Failed to access camera");
      }
    }
  };

  const startDetection = () => {
    if (!videoRef.current) return;

    const detectPerson = () => {
      if (!videoRef.current || !mountedRef.current) return;

      const results = runDetection('face', videoRef.current) as FaceLandmarkerResult;
      
      if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
        // Person detected, reset timer and hide ad
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
        if (isAdVisible) {
          setIsAdVisible(false);
        }
      } else {
        // No person detected, start timer if not already running
        if (!inactivityTimerRef.current && !isAdVisible) {
          inactivityTimerRef.current = setTimeout(() => {
            if (mountedRef.current) {
              setIsAdVisible(true);
            }
          }, inactivityTime);
        }
      }

      detectionRef.current = requestAnimationFrame(detectPerson);
    };

    detectPerson();
  };

  const cleanup = () => {
    if (detectionRef.current) {
      cancelAnimationFrame(detectionRef.current);
    }
    
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    if (imageIntervalRef.current) {
      clearInterval(imageIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  if (cameraError) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <p className="text-white text-xl">
          {cameraError}
        </p>
      </div>
    );
  }

  return (
    <>
      <video 
        ref={videoRef}
        className="hidden"
        playsInline 
        muted
      />
      
      {isAdVisible && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500"
          style={{ cursor: 'none' }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {images.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Advertisement ${index + 1}`}
                className={`absolute max-w-full max-h-full object-contain transition-opacity duration-500 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}