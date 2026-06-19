import { FaceLandmarkerResult, HandLandmarkerResult, NormalizedLandmark, PoseLandmarkerResult } from "@mediapipe/tasks-vision";
import { Camera, Download, RefreshCw, X, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DetectorType, loadDetector, runDetection, detectFaceOnImage } from "../detectors/DetectorManager";
import { supabase } from "../integrations/supabase/client";
import { getJewelryPlacement, JewelryType } from "../utils/jewelry-positioner";
import { calculateDominantEmotion, useEmotionDetection } from "../utils/useemotiondetection";
import { trackTryOnEvent } from "../utils/visitor-tracking";
import { EmotionValidationPopup } from "./emotionvalidationpopup";
import { CustomerSupportModal } from "./CustomerSupportModal";

// Function to check if an ear is visible based on landmark visibility and face angle
function checkEarVisibility(landmarks: NormalizedLandmark[], side: 'left' | 'right'): boolean {
  // Ear landmark indices
  const earTopIndex = side === 'left' ? 132 : 361;
  const earBottomIndex = side === 'left' ? 177 : 401;
  const noseIndex = 1;  // Nose tip landmark
  
  const earTop = landmarks[earTopIndex];
  const earBottom = landmarks[earBottomIndex];
  const noseTip = landmarks[noseIndex];

  if (!earTop || !earBottom || !noseTip) {
    return false;
  }

  // Check if ear landmarks are present
  if (!earTop.hasOwnProperty('x') || !earBottom.hasOwnProperty('x')) {
    return false;
  }

  // Calculate visibility based on relative position to nose
  const earX = (earTop.x + earBottom.x) / 2;
  if (side === 'left') {
    return earX < noseTip.x; // Left ear should be to the left of nose
  } else {
    return earX > noseTip.x; // Right ear should be to the right of nose
  }
}

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productImage: string;
  productName: string;
  jewelryType: JewelryType;
  detectorType: DetectorType;
  currentUserId?: string | null;
}

export function VirtualTryOn({ isOpen, onClose, productId, productImage, productName, jewelryType, detectorType, currentUserId }: VirtualTryOnProps) {
  // Refs for performance-critical values and cleanup
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const mountedRef = useRef(true);
  const hasTrackedRef = useRef(false);
  const dpiScaleRef = useRef<number>(1);
  const lastRawLandmarksRef = useRef<NormalizedLandmark[] | null>(null);
  const lastVideoSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // State that shouldn't trigger parent re-renders
  const [jewelryImage, setJewelryImage] = useState<HTMLImageElement | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDetectorReady, setIsDetectorReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // State for validation popup
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [validationData, setValidationData] = useState<{
    samples: any[];
    productName: string;
    emotionPercentages: Record<string, number>;
    uniqueEmotionCount: number;
  } | null>(null);

  // State for customer support modal
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [combinedResultImage, setCombinedResultImage] = useState<string | null>(null);

  // âœ… Handler for when session ends (user closes modal)
  const handleSessionEnd = async (samples: any[], productId: string, productName: string) => {
    console.log('[VTO] ðŸŽ¯ handleSessionEnd CALLED!');
    console.log('[VTO] ðŸ“Š Session ended for', productName, 'with', samples.length, 'samples');
    console.log('[VTO] Samples data:', samples);
    
    if (samples.length === 0) {
      console.log('[VTO] âš ï¸ No samples collected, skipping popup');
      return;
    }
    
    // Calculate emotion percentages
    console.log('[VTO] Calculating dominant emotion...');
    const { dominantEmotion, emotionCounts, totalSamples } = calculateDominantEmotion(samples);
    
    const emotionPercentages: Record<string, number> = {};
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      emotionPercentages[emotion] = Math.round((count / totalSamples) * 100);
    });
    
    const uniqueEmotionCount = Object.keys(emotionCounts).length;
    
    console.log('[VTO] Dominant emotion:', dominantEmotion);
    console.log('[VTO] Emotion percentages:', emotionPercentages);
    console.log('[VTO] Unique emotions detected:', uniqueEmotionCount);
    console.log('[VTO] ðŸŽ‰ Showing validation popup...');
    
    // Show validation popup - will save to DB when user responds
    setValidationData({ 
      samples, 
      productName, 
      emotionPercentages,
      uniqueEmotionCount 
    });
    setShowValidationPopup(true);
  };

  // âœ… Handler for validation confirmation - saves to simplified DB
  // Can receive either boolean (for 1-2 emotions) or emotion string (for 3 emotions)
  const handleValidationConfirm = async (response: boolean | string) => {
    if (!validationData) return;
    
    const { dominantEmotion, emotionCounts } = calculateDominantEmotion(validationData.samples);
    const uniqueEmotionCount = Object.keys(emotionCounts).length;
    
    let emotionToSave: string;
    let feedbackToSave: string | boolean;
    
    if (uniqueEmotionCount >= 3) {
      // Scenario 2: 3 emotions detected - save user's selected emotion
      emotionToSave = dominantEmotion; // Save AI detected dominant emotion
      feedbackToSave = response as string; // Save user's selected emotion (e.g., "happy", "neutral", "sad")
      console.log('[VTO] User selected emotion:', feedbackToSave, '(AI detected:', dominantEmotion + ')');
    } else if (uniqueEmotionCount === 2) {
      // Scenario 1b: 2 emotions detected
      emotionToSave = dominantEmotion;
      
      if (response === true) {
        // User clicked "Yes" - store "true"
        feedbackToSave = true;
        console.log('[VTO] User validation answer: YES - Accurate');
      } else {
        // User clicked "No" - store the OTHER emotion (secondary)
        const emotions = Object.keys(emotionCounts);
        const secondaryEmotion = emotions.find(e => e !== dominantEmotion);
        feedbackToSave = secondaryEmotion || 'false'; // Fallback to 'false' if no secondary
        console.log('[VTO] User disagreed. Storing secondary emotion:', feedbackToSave);
      }
    } else {
      // Scenario 1a: 1 emotion detected - boolean Yes/No feedback
      emotionToSave = dominantEmotion;
      feedbackToSave = response as boolean; // True = Yes, False = No
      console.log('[VTO] User validation answer:', feedbackToSave ? 'YES - Accurate' : 'NO - Inaccurate');
    }
   // Calculate emotion percentages for storage
    // Calculate emotion percentages for storage
    const dbemotionCounts: Record<string, number> = {};
    validationData.samples.forEach(sample => {
      const emotion = sample.emotion?.toLowerCase() || 'neutral';
      dbemotionCounts[emotion] = (dbemotionCounts[emotion] || 0) + 1;  // âœ… Fixed
    });

    const totalSamples = validationData.samples.length;
    const happyPercentage = Math.round(((dbemotionCounts.happy || 0) / totalSamples) * 100);  // âœ… Fixed
    const neutralPercentage = Math.round(((dbemotionCounts.neutral || 0) / totalSamples) * 100);  // âœ… Fixed
    const sadPercentage = Math.round(((dbemotionCounts.sad || 0) / totalSamples) * 100);  // âœ… Fixed  
    // Save to emotion_analytics table
    try {
      const { error } = await supabase
        .from('emotion_analytics')
        .insert({
          product_id: productId.toString(),
          dominant_emotion: emotionToSave,
          feedback: feedbackToSave, // String for scenario 2, boolean for scenario 1
          happy_percentage: happyPercentage,
          neutral_percentage: neutralPercentage,
          sad_percentage: sadPercentage,
          total_samples: totalSamples,
        });
      
      if (error) {
        console.error('[VTO] Failed to save analytics:', error);
      } else {
        console.log('[VTO] âœ… Analytics saved successfully');
        console.log('[VTO] Saved data:', { 
          product_id: productId.toString(), 
          dominant_emotion: emotionToSave, 
          feedback: feedbackToSave 
        });
      }
    } catch (err) {
      console.error('[VTO] Analytics save error:', err);
    }
    
    // Close popup AND close modal
    setShowValidationPopup(false);
    setValidationData(null);
    onClose(); // ðŸ”¥ NOW close the modal after validation
  };

  // âœ… Emotion detection hook - simplified (no 2-minute logic)
  const { activeWearTime, samplesCollected, getSamples } = useEmotionDetection({
    videoElement: videoRef.current,
    productId: productId.toString(),
    productName: productName,
    isActive: isOpen && hasCamera && !isLoading,
    faceDetected: faceDetected,
    onSessionEnd: handleSessionEnd,
  });

  // --- HOOK 1: Load the correct detector model when the modal opens ---
  useEffect(() => {
    if (isOpen) {
      console.log('[VTO] Loading detector:', detectorType);
      setIsLoading(true);
      setIsDetectorReady(false);
      loadDetector(detectorType)
        .then(() => {
          console.log('[VTO] Detector loaded successfully');
          setIsDetectorReady(true);
        })
        .catch(error => {
          console.error('[VTO] Detector loading failed:', error);
          setCameraError(`Failed to load the ${detectorType} model.`);
          setIsLoading(false);
        });
    }
  }, [isOpen, detectorType]);
  
  // Cleanup on unmount - only here do we truly stop the stream
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = 0;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // --- HOOK 2: Preload the jewelry image ---
  useEffect(() => {
    if (!isOpen) {
      setJewelryImage(null);
      return;
    }

    if (!productImage) {
      console.warn('[VTO] No product image provided');
      setCameraError("No jewelry image available.");
      setIsLoading(false);
      return;
    }

    // Convert relative path to public path if needed
    const publicPath = productImage.startsWith('/') 
      ? productImage 
      : `/public${productImage}`;

    if (!mountedRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for image loading
    
    img.onload = () => {
      if (mountedRef.current) {
        setJewelryImage(img);
      }
    };
    
    img.onerror = () => {
      if (mountedRef.current) {
        setCameraError("Could not load the jewelry image.");
        setIsLoading(false);
      }
    };
    
    img.src = publicPath;

    return () => {
      if (!mountedRef.current && img.src) {
        img.src = '';  // Cancel the image load
      }
    };
  }, [isOpen, productImage]);

  // Camera initialization with timeout
  useEffect(() => {
    if (!isOpen || !isDetectorReady || !jewelryImage) return;

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function initCamera() {
      try {
        if (!mountedRef.current) return;

        // Set 10 second timeout
        timeoutId = setTimeout(() => {
          if (isMounted && mountedRef.current) {
            setCameraError("Camera initialization timeout. Please try again.");
            setIsLoading(false);
          }
        }, 10000);

        // Reuse existing stream if still active (avoids camera re-init delay)
        let mediaStream = streamRef.current;
        if (!mediaStream || !mediaStream.active) {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            }
          });
          streamRef.current = mediaStream;
        }

        if (!isMounted || !mountedRef.current) {
          return;
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
          
          console.log('[VTO] Stream Resolution:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);

          if (isMounted && mountedRef.current) {
            clearTimeout(timeoutId);
            setHasCamera(true);
            setIsLoading(false);

            //Track try on event once per session
            if (!hasTrackedRef.current) {
              trackTryOnEvent(productId, productName, jewelryType, productImage, currentUserId);
              hasTrackedRef .current = true;
            }
            requestRef.current = requestAnimationFrame(predictWebcam);
          }
        }
      } catch (err) {
        if (isMounted && mountedRef.current) {
          clearTimeout(timeoutId);
          setIsLoading(false);
          setHasCamera(false);
          setCameraError(err instanceof Error ? err.message : "Failed to access camera");
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = 0;
      }
      // Keep stream alive for next open - only stopped on unmount
    };
  }, [isOpen, isDetectorReady, jewelryImage]);

  // âœ… High DPI Canvas Setup - sized to CONTAINER
  const setupHighDPICanvas = (canvas: HTMLCanvasElement) => {
    const dpi = window.devicePixelRatio || 1;
    dpiScaleRef.current = dpi;
    
    // Get container (parent element) dimensions
    const container = canvas.parentElement;
    if (!container) return;
    
    const displayWidth = container.clientWidth;
    const displayHeight = container.clientHeight;
    
    // Set canvas internal resolution with DPI scaling
    canvas.width = displayWidth * dpi;
    canvas.height = displayHeight * dpi;
    
    // Set CSS size to match container exactly
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    
    console.log('[VTO] Canvas setup:', { displayWidth, displayHeight, dpi, internalWidth: canvas.width, internalHeight: canvas.height });
  };

  const predictWebcam = () => {
    if (!mountedRef.current) return;

    const now = performance.now();
    const timeSinceLastFrame = now - lastFrameTimeRef.current;
    
    if (timeSinceLastFrame < 33) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }
    
    lastFrameTimeRef.current = now;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (!video || !canvas || !ctx || !jewelryImage || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(predictWebcam);
      return;
    }
    
    // âœ… Get container display size
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const dpi = window.devicePixelRatio || 1;
    
    // âœ… Set canvas to display size with DPI
    if (canvas.width !== displayWidth * dpi || canvas.height !== displayHeight * dpi) {
      canvas.width = displayWidth * dpi;
      canvas.height = displayHeight * dpi;
      dpiScaleRef.current = dpi;
      console.log('[VTO] Canvas:', displayWidth, 'x', displayHeight, 'DPI:', dpi);
    }
    
    // âœ… Scale context for DPI
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpi, dpi);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    
    // âœ… Calculate video scaling to fill display (cover)
    const videoAspect = video.videoWidth / video.videoHeight;
    const displayAspect = displayWidth / displayHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (videoAspect > displayAspect) {
      // Video wider - fit height
      drawHeight = displayHeight;
      drawWidth = drawHeight * videoAspect;
      offsetX = (displayWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Video taller - fit width
      drawWidth = displayWidth;
      drawHeight = drawWidth / videoAspect;
      offsetX = 0;
      offsetY = (displayHeight - drawHeight) / 2;
    }
    
    // âœ… Draw scaled video
    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
    
    // âœ… Calculate scale for landmark transformation
    const scaleX = drawWidth / video.videoWidth;
    const scaleY = drawHeight / video.videoHeight;
    
    // Run detection
    const results = runDetection(detectorType, video);
    
    let currentlyDetected = false;
    
    if (results) {
      let landmarks = null;
      
      if (detectorType === 'face') {
        const faceResults = results as FaceLandmarkerResult;
        if (faceResults.faceLandmarks?.[0]) {
          landmarks = faceResults.faceLandmarks[0];
          currentlyDetected = true;
        }
      } else if (detectorType === 'hands') {
        const handResults = results as HandLandmarkerResult;
        if (handResults.landmarks?.[0]) {
          landmarks = handResults.landmarks[0];
          currentlyDetected = true;
        }
      } else if (detectorType === 'pose') {
        const poseResults = results as PoseLandmarkerResult;
        if (poseResults.landmarks?.[0]) {
          landmarks = poseResults.landmarks[0];
          currentlyDetected = true;
        }
      }
      
      setFaceDetected(currentlyDetected);
      
      if (landmarks) {
        lastRawLandmarksRef.current = landmarks;
        lastVideoSizeRef.current = { width: video.videoWidth, height: video.videoHeight };

        // âœ… Transform landmarks: video space â†’ canvas display space
        const scaledLandmarks = landmarks.map(lm => ({
          x: (lm.x * video.videoWidth * scaleX + offsetX) / displayWidth,
          y: (lm.y * video.videoHeight * scaleY + offsetY) / displayHeight,
          z: lm.z,
          visibility: lm.visibility
        }));
        
        // âœ… Canvas object for positioning (display size)
        const positionCanvas = {
          width: displayWidth,
          height: displayHeight
        };
        
        const normalizedType = jewelryType?.toUpperCase?.();

        if (normalizedType === 'EARRINGS' || jewelryType === 'earring-left' || jewelryType === 'earrings') {
          const leftEarVisible = checkEarVisibility(scaledLandmarks, 'left');
          const rightEarVisible = checkEarVisibility(scaledLandmarks, 'right');

          const leftPlacement = leftEarVisible ? getJewelryPlacement('earring-left', scaledLandmarks, positionCanvas as any, jewelryImage) : null;
          const rightPlacement = rightEarVisible ? getJewelryPlacement('earring-right', scaledLandmarks, positionCanvas as any, jewelryImage) : null;

          if (leftPlacement && leftEarVisible) {
            ctx.drawImage(jewelryImage, leftPlacement.x, leftPlacement.y, leftPlacement.width, leftPlacement.height);
          }
          if (rightPlacement && rightEarVisible) {
            ctx.drawImage(jewelryImage, rightPlacement.x, rightPlacement.y, rightPlacement.width, rightPlacement.height);
          }
        } else {
          const placement = getJewelryPlacement(jewelryType, scaledLandmarks, positionCanvas as any, jewelryImage);
          if (placement) {
            if (Array.isArray(placement)) {
              placement.forEach(p => {
                ctx.save();
                if (p.rotation) {
                  const centerX = p.x + p.width / 2;
                  const centerY = p.y + p.height / 2;
                  ctx.translate(centerX, centerY);
                  ctx.rotate(p.rotation);
                  ctx.translate(-centerX, -centerY);
                }
                ctx.drawImage(jewelryImage, p.x, p.y, p.width, p.height);
                ctx.restore();
              });
            } else {
              if (jewelryType === 'CHAINS') {
                ctx.save();
                ctx.filter = 'brightness(1.1) contrast(1.2)';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.drawImage(jewelryImage, placement.x, placement.y, placement.width, placement.height);
                ctx.restore();
              } else {
                ctx.drawImage(jewelryImage, placement.x, placement.y, placement.width, placement.height);
              }
            }
          }
        }
      }
    } else {
      setFaceDetected(false);
    }
    
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  
  const startCamera = async () => {
    console.log('[VTO] Starting camera initialization');
    setCameraError("");
    try {
      console.log('[VTO] Requesting camera access');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30 }
        } 
      });
      console.log('[VTO] Camera access granted');

      if (!mountedRef.current) {
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }

      streamRef.current = mediaStream;
      
      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;
        await video.play();

        if (mountedRef.current) {
          setHasCamera(true);
          setIsLoading(false);
          requestRef.current = requestAnimationFrame(predictWebcam);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setIsLoading(false);
        setHasCamera(false);
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') setCameraError("Camera permission denied.");
          else if (err.name === 'NotFoundError') setCameraError("No camera found.");
          else setCameraError("Unable to access camera.");
        }
      }
    }
  };

  const captureRawVideoFrame = (): string | null => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;
    const offscreen = document.createElement('canvas');
    offscreen.width = video.videoWidth;
    offscreen.height = video.videoHeight;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return offscreen.toDataURL('image/jpeg', 0.9);
  };

  const drawJewelryOnResult = async (resultDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const resultImg = new Image();
      resultImg.crossOrigin = 'anonymous';
      resultImg.onload = async () => {
        const offscreen = document.createElement('canvas');
        offscreen.width = resultImg.width;
        offscreen.height = resultImg.height;
        const ctx = offscreen.getContext('2d');
        if (!ctx || !jewelryImage) { resolve(resultDataUrl); return; }

        ctx.drawImage(resultImg, 0, 0);

        // Re-detect face landmarks on the result image for accurate jewelry placement.
        // Vertex AI output has different dimensions/framing than the original video frame,
        // so raw video landmarks would be misaligned.
        let landmarks = await detectFaceOnImage(resultImg).catch(() => null);
        if (!landmarks) {
          landmarks = lastRawLandmarksRef.current;
        }
        if (!landmarks) { resolve(offscreen.toDataURL('image/png')); return; }

        const positionCanvas = { width: resultImg.width, height: resultImg.height };
        const normalizedType = jewelryType?.toUpperCase?.();

        if (normalizedType === 'EARRINGS' || jewelryType === 'earring-left' || jewelryType === 'earrings') {
          const left = getJewelryPlacement('earring-left', landmarks, positionCanvas as any, jewelryImage);
          const right = getJewelryPlacement('earring-right', landmarks, positionCanvas as any, jewelryImage);
          if (left && !Array.isArray(left)) ctx.drawImage(jewelryImage, left.x, left.y, left.width, left.height);
          if (right && !Array.isArray(right)) ctx.drawImage(jewelryImage, right.x, right.y, right.width, right.height);
        } else {
          const placement = getJewelryPlacement(jewelryType, landmarks, positionCanvas as any, jewelryImage);
          if (placement) {
            if (Array.isArray(placement)) {
              placement.forEach(p => {
                ctx.save();
                if (p.rotation) {
                  const cx = p.x + p.width / 2;
                  const cy = p.y + p.height / 2;
                  ctx.translate(cx, cy); ctx.rotate(p.rotation); ctx.translate(-cx, -cy);
                }
                ctx.drawImage(jewelryImage, p.x, p.y, p.width, p.height);
                ctx.restore();
              });
            } else {
              ctx.drawImage(jewelryImage, placement.x, placement.y, placement.width, placement.height);
            }
          }
        }
        resolve(offscreen.toDataURL('image/png'));
      };
      resultImg.onerror = () => resolve(resultDataUrl);
      resultImg.src = resultDataUrl;
    });
  };

  const stopCamera = () => {
    console.log('[VTO] Stopping camera and cleaning up');
    
    // Cancel animation frame
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = 0;
    }
    
    // Keep stream alive for fast re-open - only stop on unmount
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    // Reset all states
    setIsLoading(true);
    setHasCamera(false);
    setIsDetectorReady(false);
    setFaceDetected(false);
    lastFrameTimeRef.current = 0;
    
    console.log('[VTO] Cleanup completed');
  };

  // ðŸ”¥ FIX: Handle close button - get samples BEFORE cleanup
  const handleClose = () => {
    console.log('[VTO] ðŸšª Close button clicked');
    
    // Get samples BEFORE any cleanup
    if (getSamples) {
      const samples = getSamples();
      console.log('[VTO] ðŸ“Š Retrieved', samples.length, 'samples before closing');
      
      if (samples.length > 0) {
        console.log('[VTO] ðŸŽ¯ Triggering session end with samples');
        // Trigger session end which will show the validation popup
        handleSessionEnd(samples, productId.toString(), productName);
        // Clean up camera but DON'T close modal yet - wait for validation
        stopCamera();
        return; // Don't call onClose() - validation popup will handle it
      }
    }
    
    // No samples, close normally
    console.log('[VTO] No samples to validate, closing normally');
    stopCamera();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-11/12 aspect-[3/4] bg-[#fcf5f1] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/50 to-transparent">
            <div>
              <h2 className="font-['Playfair_Display'] text-white text-3xl">Virtual Try-On</h2>
              <p className="font-['Montserrat'] text-white/80 text-sm mt-1">{productName}</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Customer Support Button */}
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="absolute bottom-6 right-6 z-20 p-4 rounded-full bg-[#7c563d] hover:bg-[#6a4a33] shadow-2xl transition-all hover:scale-110"
            aria-label="Customer Support"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* Debug Overlay */}
          {hasCamera && !isLoading && (
            <div className="absolute bottom-4 left-4 z-20 bg-black/70 text-white text-xs p-3 rounded-lg font-mono">
              <div>Face: {faceDetected ? 'âœ…' : 'âŒ'}</div>
              <div>Time: {activeWearTime}s</div>
              <div>Samples: {samplesCollected}</div>
            </div>
          )}


          {/* Processing overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 rounded-3xl gap-5">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#d4af37] border-t-transparent" />
              <div className="text-center space-y-1">
                <p className="font-['Playfair_Display'] text-white text-xl">Generating Your Look</p>
                <p className="font-['Montserrat'] text-white/60 text-sm">Applying saree & jewelry...</p>
              </div>
            </div>
          )}

          {/* Combined result view */}
          {combinedResultImage && (
            <div className="absolute inset-0 z-40 flex flex-col bg-black rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-black/50">
                <h3 className="font-['Playfair_Display'] text-white text-xl">Your Complete Look</h3>
                <button
                  onClick={() => setCombinedResultImage(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <img src={combinedResultImage} alt="Your complete look" className="w-full h-full object-contain" />
              </div>
              <div className="flex gap-3 px-6 py-4 bg-black/50">
                <button
                  onClick={() => { setCombinedResultImage(null); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 font-['Montserrat'] text-white/70 text-sm hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <a
                  href={combinedResultImage}
                  download="my-look.png"
                  className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-full bg-[#d4af37] font-['Montserrat'] text-white text-sm font-medium hover:bg-[#c4a028] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Save Look
                </a>
              </div>
            </div>
          )}

          <div className="relative w-full h-full flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="hidden" />
            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#7c563d] border-t-transparent" />
                <p className="font-['Montserrat'] text-[#7c563d] text-center px-8">
                  {isDetectorReady ? "Starting camera..." : "Loading AI model..."}
                </p>
              </div>
            )}
            {!isLoading && hasCamera && (
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full " />
            )}
            {!isLoading && !hasCamera && (
              <div className="flex flex-col items-center justify-center gap-6 max-w-md">
                <Camera className="w-24 h-24 text-[#7c563d]/30" />
                <div className="text-center space-y-2">
                  <p className="font-['Montserrat'] text-[#7c563d] font-medium text-lg">{cameraError || "Camera access required"}</p>
                  <p className="font-['Montserrat'] text-[#7c563d]/70 text-sm px-8">Please allow camera access to try on jewelry virtually.</p>
                </div>
                <button onClick={startCamera} className="px-6 py-3 bg-[#7c563d] text-white rounded-full font-['Montserrat'] font-medium hover:bg-[#6a4a33] transition-colors">
                  Enable Camera
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validation Popup */}
      {showValidationPopup && validationData && (
        <EmotionValidationPopup
          isOpen={showValidationPopup}
          productName={validationData.productName}
          samples={validationData.samples}
          emotionPercentages={validationData.emotionPercentages}
          uniqueEmotionCount={validationData.uniqueEmotionCount}
          onConfirm={handleValidationConfirm}
        />
      )}

      {/* Customer Support Modal */}
      <CustomerSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </>
  );
}