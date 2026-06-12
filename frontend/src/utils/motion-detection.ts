/**
 * Motion and Face Detection Service
 * Handles real-time motion detection and face detection for security monitoring
 */

interface DetectionResult {
  motionDetected: boolean;
  faceDetected: boolean;
  motionLevel: number; // 0-100, percentage of change
  faceCount: number;
}

/**
 * Motion Detection using frame differencing
 */
export class MotionDetector {
  private previousFrame: ImageData | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private motionThreshold: number = 35; // Increased sensitivity threshold to reduce false triggers
  private minChangePercentage: number = 5; // Require 5% pixel change (more significant movement)

  constructor(width: number = 640, height: number = 480) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
  }

  /**
   * Detect motion by comparing current frame with previous frame
   */
  public detectMotion(videoElement: HTMLVideoElement): boolean {
    try {
      // Draw current frame to canvas
      this.ctx.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);
      const currentFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

      // If no previous frame, store this one and return false
      if (!this.previousFrame) {
        this.previousFrame = currentFrame;
        return false;
      }

      // Compare frames
      const motionLevel = this.compareFrames(this.previousFrame, currentFrame);
      
      // Store current frame for next comparison
      this.previousFrame = currentFrame;

      // Return true if motion level exceeds threshold
      return motionLevel > this.minChangePercentage;

    } catch (error) {
      console.error('[Motion Detector] Detection error:', error);
      return false;
    }
  }

  /**
   * Compare two frames and return motion percentage
   */
  private compareFrames(frame1: ImageData, frame2: ImageData): number {
    const data1 = frame1.data;
    const data2 = frame2.data;
    let changedPixels = 0;
    const totalPixels = this.canvas.width * this.canvas.height;

    // Compare every 4th pixel (RGBA) for performance
    for (let i = 0; i < data1.length; i += 4) {
      const r1 = data1[i];
      const g1 = data1[i + 1];
      const b1 = data1[i + 2];

      const r2 = data2[i];
      const g2 = data2[i + 1];
      const b2 = data2[i + 2];

      // Calculate difference
      const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);

      if (diff > this.motionThreshold) {
        changedPixels++;
      }
    }

    // Return percentage of changed pixels
    return (changedPixels / totalPixels) * 100;
  }

  /**
   * Reset motion detector (clears previous frame)
   */
  public reset(): void {
    this.previousFrame = null;
  }

  /**
   * Set motion sensitivity
   */
  public setSensitivity(threshold: number, minChangePercent: number): void {
    this.motionThreshold = threshold;
    this.minChangePercentage = minChangePercent;
  }
}

/**
 * Face Detection using existing MediaPipe or face detection system
 */
export class FaceDetector {
  private lastDetectedFaces: any[] = [];
  
  /**
   * Detect faces using MediaPipe FaceMesh (if available)
   * This integrates with your existing face detection system
   */
  public async detectFaces(videoElement: HTMLVideoElement, faceMesh: any): Promise<boolean> {
    try {
      // Use your existing MediaPipe face detection
      if (!faceMesh) {
        console.warn('[Face Detector] FaceMesh not initialized');
        return false;
      }

      const results = await faceMesh.send({ image: videoElement });
      
      if (results && results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
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

  /**
   * Simple face detection using canvas (fallback method)
   */
  public detectFacesSimple(videoElement: HTMLVideoElement): boolean {
    // DISABLED: Simple brightness-based detection is too unreliable
    // It triggers on walls, laptops, desks - anything with "normal" brightness
    // Only use MediaPipe FaceMesh for accurate face detection
    console.log('[Face Detector] Simple detection disabled - use MediaPipe only');
    return false;
  }

  /**
   * Calculate average brightness of image data
   */
  private calculateAverageBrightness(imageData: ImageData): number {
    const data = imageData.data;
    let totalBrightness = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
    }
    
    return totalBrightness / (data.length / 4);
  }

  /**
   * Get number of detected faces
   */
  public getFaceCount(): number {
    return this.lastDetectedFaces.length;
  }

  /**
   * Check if a new face appeared (different from last detected)
   */
  public isNewFace(currentFaces: any[]): boolean {
    // Simple check: if face count changed, it's a new face
    if (currentFaces.length !== this.lastDetectedFaces.length) {
      return true;
    }
    
    // More sophisticated: compare face positions
    // This is simplified - you can enhance with actual face recognition
    if (currentFaces.length === 0) {
      return false;
    }

    return false; // For now, assume same face if count is same
  }
}

/**
 * Combined Security Detector
 * Uses both motion and face detection
 */
export class SecurityDetector {
  private motionDetector: MotionDetector;
  private faceDetector: FaceDetector;
  private lastMotionTime: number = 0;
  private lastFaceTime: number = 0;
  private motionStabilityCounter: number = 0;
  private readonly MOTION_STABILITY_THRESHOLD = 2; // Require 3 consecutive motion detections

  constructor() {
    this.motionDetector = new MotionDetector(640, 480);
    this.faceDetector = new FaceDetector();
  }

  /**
   * Perform complete security detection
   */
  public async detect(
    videoElement: HTMLVideoElement,
    faceMesh?: any
  ): Promise<DetectionResult> {
    const rawMotionDetected = this.motionDetector.detectMotion(videoElement);
    
    // Stability counter: require multiple consecutive motion detections
    if (rawMotionDetected) {
      this.motionStabilityCounter++;
    } else {
      this.motionStabilityCounter = 0;
    }
    
    // Only report motion if we've detected it N times in a row
    const motionDetected = this.motionStabilityCounter >= this.MOTION_STABILITY_THRESHOLD;
    
    let faceDetected = false;
    if (faceMesh) {
      // Use MediaPipe for accurate face detection
      faceDetected = await this.faceDetector.detectFaces(videoElement, faceMesh);
    } else {
      // Simple detection is disabled (too many false positives)
      faceDetected = false;
    }

    const now = Date.now();

    if (motionDetected) {
      this.lastMotionTime = now;
    }

    if (faceDetected) {
      this.lastFaceTime = now;
    }

    return {
      motionDetected,
      faceDetected,
      motionLevel: motionDetected ? 50 : 0,
      faceCount: this.faceDetector.getFaceCount()
    };
  }

  /**
   * Reset all detectors
   */
  public reset(): void {
    this.motionDetector.reset();
    this.lastMotionTime = 0;
    this.lastFaceTime = 0;
    this.motionStabilityCounter = 0;
  }

  /**
   * Set motion sensitivity
   */
  public setMotionSensitivity(threshold: number, minChangePercent: number): void {
    this.motionDetector.setSensitivity(threshold, minChangePercent);
  }
}