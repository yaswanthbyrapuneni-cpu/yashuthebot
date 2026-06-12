import { useEffect, useRef, useState } from "react";
import { FaceMesh, Results } from "@mediapipe/face_mesh";

interface NeckPosition {
  x: number;
  y: number;
  scale: number;
  confidence: number;
}

export function useFaceTracking(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  enabled: boolean
) {
  const [neckPosition, setNeckPosition] = useState<NeckPosition | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const smoothPositionRef = useRef<NeckPosition | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;
    if (!videoRef.current || !canvasRef.current) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    // Initialize FaceMesh
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results: Results) => {
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        setNeckPosition(null);
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];
      
      // Key landmarks for neck position:
      // 234: left jaw
      // 454: right jaw
      // 152: chin center
      const leftJaw = landmarks[234];
      const rightJaw = landmarks[454];
      const chin = landmarks[152];

      if (!leftJaw || !rightJaw || !chin) return;

      // Calculate neck center (below chin)
      const jawWidth = Math.abs(rightJaw.x - leftJaw.x);
      const faceWidth = jawWidth * canvasElement.width;
      
      const neckCenterX = (leftJaw.x + rightJaw.x) / 2;
      const neckCenterY = chin.y + jawWidth * 0.3; // Offset down from chin

      const newPosition: NeckPosition = {
        x: neckCenterX * canvasElement.width,
        y: neckCenterY * canvasElement.height,
        scale: faceWidth / 200, // Normalize scale
        confidence: 1.0,
      };

      // Smooth tracking with lerp
      if (smoothPositionRef.current) {
        const lerp = 0.3; // Smoothing factor
        smoothPositionRef.current = {
          x: smoothPositionRef.current.x * (1 - lerp) + newPosition.x * lerp,
          y: smoothPositionRef.current.y * (1 - lerp) + newPosition.y * lerp,
          scale: smoothPositionRef.current.scale * (1 - lerp) + newPosition.scale * lerp,
          confidence: newPosition.confidence,
        };
      } else {
        smoothPositionRef.current = newPosition;
      }

      setNeckPosition(smoothPositionRef.current);
    });

    faceMeshRef.current = faceMesh;

    // Drive FaceMesh with the existing video stream using requestAnimationFrame
    const render = async () => {
      if (faceMeshRef.current && videoElement.readyState >= 2) {
        try {
          await faceMeshRef.current.send({ image: videoElement });
        } catch (_) {
          // Ignore transient processing errors
        }
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    if (videoElement.readyState >= 2) {
      render();
    } else {
      const onLoadedData = () => {
        render();
      };
      videoElement.addEventListener("loadeddata", onLoadedData, { once: true });
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [videoRef, canvasRef, enabled]);

  return neckPosition;
}
