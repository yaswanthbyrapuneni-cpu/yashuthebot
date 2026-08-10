/**
 * Motion and Face Detection Service
 * Handles real-time motion detection for security monitoring
 *
 * NOTE: Face detection requires MediaPipe FaceMesh to be passed into detect().
 *       Without it, only motion detection fires.
 */

interface DetectionResult {
  motionDetected: boolean;
  faceDetected: boolean;
  motionLevel: number;
  faceCount: number;
}

export class MotionDetector {
  private previousFrame: ImageData | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private motionThreshold: number = 35;
  private minChangePercentage: number = 5; // require 5% pixel change

  constructor(width: number = 640, height: number = 480) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
  }

  public detectMotion(videoElement: HTMLVideoElement): boolean {
    try {
      this.ctx.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);
      const currentFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

      if (!this.previousFrame) {
        this.previousFrame = currentFrame;
        return false;
      }

      const motionLevel = this.compareFrames(this.previousFrame, currentFrame);
      this.previousFrame = currentFrame;
      return motionLevel > this.minChangePercentage;

    } catch (error) {
      console.error('[Motion Detector] Detection error:', error);
      return false;
    }
  }

  private compareFrames(frame1: ImageData, frame2: ImageData): number {
    const data1 = frame1.data;
    const data2 = frame2.data;
    let changedPixels = 0;
    const totalPixels = this.canvas.width * this.canvas.height;

    for (let i = 0; i < data1.length; i += 4) {
      const diff =
        Math.abs(data1[i] - data2[i]) +
        Math.abs(data1[i + 1] - data2[i + 1]) +
        Math.abs(data1[i + 2] - data2[i + 2]);
      if (diff > this.motionThreshold) changedPixels++;
    }

    return (changedPixels / totalPixels) * 100;
  }

  public reset(): void {
    this.previousFrame = null;
  }

  public setSensitivity(threshold: number, minChangePercent: number): void {
    this.motionThreshold = threshold;
    this.minChangePercentage = minChangePercent;
  }
}

export class FaceDetector {
  private lastDetectedFaces: any[] = [];

  public async detectFaces(videoElement: HTMLVideoElement, faceMesh: any): Promise<boolean> {
    try {
      if (!faceMesh) return false;
      const results = await faceMesh.send({ image: videoElement });
      if (results?.multiFaceLandmarks?.length > 0) {
        this.lastDetectedFaces = results.multiFaceLandmarks;
        return true;
      }
      this.lastDetectedFaces = [];
      return false;
    } catch (error) {
      console.error('[Face Detector] Detection error:', error);
      return false;
    }
  }

  public getFaceCount(): number {
    return this.lastDetectedFaces.length;
  }
}

export class SecurityDetector {
  private motionDetector: MotionDetector;
  private faceDetector: FaceDetector;
  private motionStabilityCounter: number = 0;
  private readonly MOTION_STABILITY_THRESHOLD = 2; // require 2 consecutive detections

  constructor() {
    this.motionDetector = new MotionDetector(640, 480);
    this.faceDetector = new FaceDetector();
  }

  public async detect(
    videoElement: HTMLVideoElement,
    faceMesh?: any
  ): Promise<DetectionResult> {
    const rawMotion = this.motionDetector.detectMotion(videoElement);

    if (rawMotion) {
      this.motionStabilityCounter++;
    } else {
      this.motionStabilityCounter = 0;
    }

    const motionDetected = this.motionStabilityCounter >= this.MOTION_STABILITY_THRESHOLD;

    let faceDetected = false;
    if (faceMesh) {
      faceDetected = await this.faceDetector.detectFaces(videoElement, faceMesh);
    }

    return {
      motionDetected,
      faceDetected,
      motionLevel: motionDetected ? 50 : 0,
      faceCount: this.faceDetector.getFaceCount(),
    };
  }

  public reset(): void {
    this.motionDetector.reset();
    this.motionStabilityCounter = 0;
  }

  public setMotionSensitivity(threshold: number, minChangePercent: number): void {
    this.motionDetector.setSensitivity(threshold, minChangePercent);
  }
}
