import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker;
let vision: any = null;

async function initializeVisionResolver() {
  if (!vision) {
    vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
  }
}

export async function loadDetector(type: "face") {
  await initializeVisionResolver();
  if (type === "face" && !faceLandmarker) {
    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
    });
  }
}

export function runDetection(type: "face", video: HTMLVideoElement) {
  if (type === "face" && faceLandmarker) {
    return faceLandmarker.detectForVideo(video, performance.now());
  }
  return null;
}
