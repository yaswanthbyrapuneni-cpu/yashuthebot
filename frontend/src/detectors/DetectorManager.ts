import {
  FaceLandmarker,
  HandLandmarker,
  PoseLandmarker,
  FilesetResolver,
  NormalizedLandmark
} from "@mediapipe/tasks-vision";

// Define the types of detectors our manager can handle
export type DetectorType = 'face' | 'hands' | 'pose';

// This will hold our initialized MediaPipe models
let faceLandmarker: FaceLandmarker;
let handLandmarker: HandLandmarker;
let poseLandmarker: PoseLandmarker;
let imageFaceLandmarker: FaceLandmarker | null = null;

let vision: any = null;

/**
 * Initializes the core MediaPipe vision task resolver.
 * This only needs to run once.
 */
async function initializeVisionResolver() {
  if (!vision) {
    vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
  }
}

/**
 * Loads a specific detector model. If the model is already loaded,
 * it returns the existing instance.
 * @param {DetectorType} type - The type of detector to load ('face', 'hands', 'pose').
 */
export async function loadDetector(type: DetectorType) {
  await initializeVisionResolver();

  try {
    if (type === 'face' && !faceLandmarker) {
      console.log("Loading FaceLandmarker model...");
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });
      console.log("FaceLandmarker model loaded.");
    } else if (type === 'hands' && !handLandmarker) {
      console.log("Loading HandLandmarker model...");
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      console.log("HandLandmarker model loaded.");
    } else if (type === 'pose' && !poseLandmarker) {
      console.log("Loading PoseLandmarker model...");
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      console.log("PoseLandmarker model loaded.");
    }
  } catch (error) {
    console.error(`Failed to load ${type} model:`, error);
    throw new Error(`Could not initialize the ${type} detector.`);
  }
}

/**
 * Runs detection on a video frame using the specified model.
 * @param {DetectorType} type - The type of detection to run.
 * @param {HTMLVideoElement} video - The video element with the live feed.
 * @returns The detection results from the MediaPipe model.
 */
export function runDetection(type: DetectorType, video: HTMLVideoElement) {
  const now = performance.now();
  
  if (type === 'face' && faceLandmarker) {
    return faceLandmarker.detectForVideo(video, now);
  }
  if (type === 'hands' && handLandmarker) {
    return handLandmarker.detectForVideo(video, now);
  }
  if (type === 'pose' && poseLandmarker) {
    return poseLandmarker.detectForVideo(video, now);
  }

  return null;
}

/**
 * Runs face landmark detection on a static HTMLImageElement.
 * Uses a separate IMAGE-mode landmarker so it doesn't conflict with the VIDEO-mode one.
 * Returns the first face's landmarks, or null if no face detected.
 */
export async function detectFaceOnImage(img: HTMLImageElement): Promise<NormalizedLandmark[] | null> {
  await initializeVisionResolver();

  if (!imageFaceLandmarker) {
    imageFaceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numFaces: 1,
    });
  }

  const result = imageFaceLandmarker.detect(img);
  if (result?.faceLandmarks?.[0]) {
    return result.faceLandmarks[0];
  }
  return null;
}