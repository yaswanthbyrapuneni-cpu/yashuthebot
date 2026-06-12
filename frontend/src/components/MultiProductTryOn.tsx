import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadDetector, runDetection } from "../detectors/DetectorManager";
import type { DetectorType } from "../detectors/DetectorManager";
import { getJewelryPlacement } from "../utils/jewelry-positioner";
import { getDetectorForJewelry } from "../utils/detector-mapper";
import type { JewelryType } from "../utils/jewelry-positioner";
import { trackTryOnEvent } from "@/utils/visitor-tracking";

interface Product {
  id: number;
  name: string;
  image: string;
  type: JewelryType;
}

interface MultiProductTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export function MultiProductTryOn({ isOpen, onClose, products }: MultiProductTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [detectorStatuses, setDetectorStatuses] = useState<Record<string, boolean>>({});
  const animationFrameRef = useRef<number>();
  const jewelryImagesRef = useRef<Record<number, HTMLImageElement>>({});

  // Preload all jewelry images
  useEffect(() => {
    if (!isOpen) return;

    const loadImages = async () => {
      const imagePromises = products.map((product) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            jewelryImagesRef.current[product.id] = img;
            resolve();
          };
          img.onerror = () => reject(new Error(`Failed to load ${product.name}`));
          img.src = product.image;
        });
      });

      try {
        await Promise.all(imagePromises);
        console.log('All jewelry images loaded');
      } catch (err) {
        console.error('Error loading jewelry images:', err);
        setError('Failed to load jewelry images');
      }
    };

    loadImages();
  }, [isOpen, products]);

  // Load all required detectors
  useEffect(() => {
    if (!isOpen) return;

    const loadAllDetectors = async () => {
      setIsLoading(true);
      const requiredDetectors = new Set<DetectorType>();
      
      // Determine which detectors we need
      products.forEach(product => {
        const detectorType = getDetectorForJewelry(product.type);
        requiredDetectors.add(detectorType);
      });

      console.log('Loading detectors:', Array.from(requiredDetectors));

      // Load all detectors in parallel
      const loadPromises = Array.from(requiredDetectors).map(async (detectorType) => {
        try {
          await loadDetector(detectorType);
          setDetectorStatuses(prev => ({ ...prev, [detectorType]: true }));
          console.log(`${detectorType} detector loaded`);
        } catch (err) {
          console.error(`Error loading ${detectorType} detector:`, err);
          setDetectorStatuses(prev => ({ ...prev, [detectorType]: false }));
        }
      });

      await Promise.all(loadPromises);
      setIsLoading(false);
    };

    loadAllDetectors();
  }, [isOpen, products]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
        setError(null);

        // Track try-on events for all products
        products.forEach(product => {
          trackTryOnEvent(product.id, product.name, product.type);
        });
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please grant camera permissions.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  // Prediction loop
  const predictWebcam = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== 4) {
      animationFrameRef.current = requestAnimationFrame(predictWebcam);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Run detection for each product type and draw jewelry
    for (const product of products) {
      const detectorType = getDetectorForJewelry(product.type);
      const jewelryImage = jewelryImagesRef.current[product.id];

      if (!jewelryImage || !detectorStatuses[detectorType]) continue;

      try {
        const results = await runDetection(detectorType, video);
        
        if (results && results.length > 0) {
          const landmarks = results[0];
          const placement = getJewelryPlacement(
            product.type,
            landmarks,
            canvas,
            jewelryImage
          );

          if (placement) {
            ctx.save();
            
            if (Array.isArray(placement)) {
              // Multiple items (e.g., bangles)
              placement.forEach(item => {
                ctx.save();
                if (item.rotation) {
                  ctx.translate(item.x + item.width / 2, item.y + item.height / 2);
                  ctx.rotate(item.rotation);
                  ctx.drawImage(jewelryImage, -item.width / 2, -item.height / 2, item.width, item.height);
                } else {
                  ctx.drawImage(jewelryImage, item.x, item.y, item.width, item.height);
                }
                ctx.restore();
              });
            } else {
              // Single item
              if (placement.rotation) {
                ctx.translate(placement.x + placement.width / 2, placement.y + placement.height / 2);
                ctx.rotate(placement.rotation);
                ctx.drawImage(jewelryImage, -placement.width / 2, -placement.height / 2, placement.width, placement.height);
              } else {
                ctx.drawImage(jewelryImage, placement.x, placement.y, placement.width, placement.height);
              }
            }
            
            ctx.restore();
          }
        }
      } catch (err) {
        console.error(`Error processing ${product.type}:`, err);
      }
    }

    animationFrameRef.current = requestAnimationFrame(predictWebcam);
  };

  // Start prediction when camera is ready
  useEffect(() => {
    if (cameraReady && !isLoading) {
      predictWebcam();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraReady, isLoading, detectorStatuses]);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen && !isLoading) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-11/12 max-w-4xl aspect-[4/3] bg-background rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/50 to-transparent">
          <div>
            <h2 className="font-['Playfair_Display'] text-white text-3xl">Surprise Try-On! ✨</h2>
            <p className="font-['Montserrat'] text-white/80 text-sm mt-1">
              {products.map(p => p.name).join(' + ')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Video and Canvas */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            style={{ display: cameraReady ? 'none' : 'block' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: cameraReady ? 'block' : 'none' }}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4" />
              <p className="font-['Montserrat'] text-foreground">Loading AI models...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <p className="font-['Montserrat'] text-destructive text-center px-8 mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-['Montserrat'] hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}