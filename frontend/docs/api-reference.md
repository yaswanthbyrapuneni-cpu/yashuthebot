# API Reference

## Core APIs

### DetectorManager API

#### `loadDetector(type: DetectorType): Promise<void>`
Loads and initializes a specific ML model.

```typescript
type DetectorType = 'face' | 'hands' | 'pose';

// Usage
await loadDetector('face');
```

#### `runDetection(type: DetectorType, video: HTMLVideoElement)`
Processes a video frame and returns detection results.

```typescript
const results = runDetection('face', videoElement);
```

### JewelryPositioner API

#### `getJewelryPlacement(type: JewelryType, landmarks: NormalizedLandmark[], canvas: HTMLCanvasElement, image: HTMLImageElement): Placement | Placement[] | null`

Calculates jewelry placement based on detected landmarks.

```typescript
interface Placement {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  side?: 'left' | 'right';
}

// Usage
const placement = getJewelryPlacement('necklace', landmarks, canvas, jewelryImage);
```

#### Supported Jewelry Types
```typescript
type JewelryType =
  | 'necklace'
  | 'earring-left'
  | 'earring-right'
  | 'earrings'
  | 'nose-pin'
  | 'ring'
  | 'bracelet'
  | 'bangles'
  | 'pendant'
  | 'CHAINS'
  | 'HARAMS'
  | 'HIPBELT'
  | 'MATHAPATTI'
  | 'FOREHEAD';
```

## Component APIs

### VirtualTryOn Component

```typescript
interface VirtualTryOnProps {
  isOpen: boolean;          // Control modal visibility
  onClose: () => void;      // Modal close handler
  productImage: string;     // Jewelry image URL
  productName: string;      // Display name
  jewelryType: JewelryType; // Type of jewelry
  detectorType: DetectorType; // Type of detector to use
}
```

#### Events
- `onClose`: Called when the modal is closed
- `onCameraError`: Called when camera access fails
- `onDetectorError`: Called when ML model fails
- `onFrameProcessed`: Called after each frame processing

### Utility Functions

#### `checkEarVisibility(landmarks: NormalizedLandmark[], side: 'left' | 'right'): boolean`
Determines if an ear is visible in the current frame.

```typescript
const isLeftEarVisible = checkEarVisibility(landmarks, 'left');
```

## MediaPipe Integration

### Face Landmarker

```typescript
interface FaceLandmarkerConfig {
  baseOptions: {
    modelAssetPath: string;
    delegate: "GPU" | "CPU";
  };
  runningMode: "VIDEO";
  numFaces: number;
}
```

### Hand Landmarker

```typescript
interface HandLandmarkerConfig {
  baseOptions: {
    modelAssetPath: string;
    delegate: "GPU" | "CPU";
  };
  runningMode: "VIDEO";
  numHands: number;
}
```

### Pose Landmarker

```typescript
interface PoseLandmarkerConfig {
  baseOptions: {
    modelAssetPath: string;
    delegate: "GPU" | "CPU";
  };
  runningMode: "VIDEO";
  numPoses: number;
}
```

## Error Types

```typescript
interface DetectorError extends Error {
  type: 'INITIALIZATION' | 'PROCESSING' | 'RESOURCE';
  detectorType: DetectorType;
}

interface CameraError extends Error {
  type: 'PERMISSION' | 'NOT_FOUND' | 'CONSTRAINT';
}
```

## Event Types

```typescript
interface FrameProcessingEvent {
  timestamp: number;
  detectorType: DetectorType;
  hasResults: boolean;
  frameNumber: number;
}

interface JewelryPlacementEvent {
  type: JewelryType;
  successful: boolean;
  placement?: Placement | Placement[];
}
```

## Configuration Types

```typescript
interface DetectorConfig {
  modelPath: string;
  delegate: "GPU" | "CPU";
  runningMode: "VIDEO" | "IMAGE";
  maxObjects: number;
}

interface VideoConfig {
  width: { ideal: number };
  height: { ideal: number };
  facingMode: "user" | "environment";
  frameRate: { ideal: number };
}
```

## Constants

```typescript
const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  facingMode: "user",
  frameRate: { ideal: 30 }
};

const MODEL_PATHS = {
  face: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
  hands: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
  pose: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
};
```