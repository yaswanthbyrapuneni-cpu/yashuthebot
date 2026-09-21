import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | undefined;
let faceLoadPromise: Promise<void> | null = null;
let vision: any = null;

async function initializeVisionResolver() {
  if (!vision) {
    vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
  }
}

// IdleDetector, SecurityMonitor and the try-on mirror can all call this at
// the same moment. Checking `!faceLandmarker` alone let each of them start
// its own createFromOptions before the first finished, building several GPU
// landmarkers on a kiosk that can barely afford one. Sharing the in-flight
// promise makes them wait on the same load; it is cleared on failure so a
// transient error (network blip fetching the model) can be retried.
export function loadDetector(type: "face"): Promise<void> {
  if (type !== "face") return Promise.resolve();
  if (faceLandmarker) return Promise.resolve();
  if (!faceLoadPromise) {
    faceLoadPromise = (async () => {
      await initializeVisionResolver();
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });
    })().catch((err) => {
      faceLoadPromise = null;
      throw err;
    });
  }
  return faceLoadPromise;
}

export function runDetection(type: "face", video: HTMLVideoElement) {
  if (type === "face" && faceLandmarker) {
    return faceLandmarker.detectForVideo(video, performance.now());
  }
  return null;
}
