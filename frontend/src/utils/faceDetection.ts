import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";

// Singleton instance
let detectorInstance: faceLandmarksDetection.FaceLandmarksDetector | null = null;
let isLoading = false;
let loadingPromise: Promise<faceLandmarksDetection.FaceLandmarksDetector> | null = null;

// Suppress TensorFlow.js warnings
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  console.warn = (...args: any[]) => {
    const message = String(args[0] || '');
    if (
      message.includes('already registered') ||
      message.includes('already been set') ||
      message.includes('Platform') ||
      message.includes('backend') ||
      message.includes('kernel') ||
      message.includes('Overwriting')
    ) {
      return; // Suppress TensorFlow warnings
    }
    originalWarn.apply(console, args);
  };
  
  console.log = (...args: any[]) => {
    const message = String(args[0] || '');
    if (
      message.includes('already registered') ||
      message.includes('backend')
    ) {
      return; // Suppress TensorFlow logs
    }
    originalLog.apply(console, args);
  };
}

export async function getFaceDetector(): Promise<faceLandmarksDetection.FaceLandmarksDetector> {
  // If we already have a detector, return it
  if (detectorInstance) {
    return detectorInstance;
  }

  // If we're currently loading, wait for that to complete
  if (isLoading && loadingPromise) {
    return loadingPromise;
  }

  // Start loading
  isLoading = true;
  loadingPromise = loadDetector();

  try {
    detectorInstance = await loadingPromise;
    return detectorInstance;
  } finally {
    isLoading = false;
    loadingPromise = null;
  }
}

async function loadDetector(): Promise<faceLandmarksDetection.FaceLandmarksDetector> {
  try {
    // Ensure backend is ready
    await tf.ready();
    
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig = {
      runtime: "tfjs",
      refineLandmarks: true,
      maxFaces: 1,
    };
    
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    return detector;
  } catch (error) {
    console.error("Failed to load face detector:", error);
    throw new Error("Failed to initialize face detection model");
  }
}

export function resetDetector() {
  detectorInstance = null;
}
