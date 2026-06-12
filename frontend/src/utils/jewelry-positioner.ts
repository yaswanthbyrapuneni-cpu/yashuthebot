import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// Define the types of jewelry we can place
export type JewelryType =
  | 'necklace'
  | 'earring-left'
  | 'earring-right'
  | 'earrings'      // Added for product type compatibility
  | 'EARRINGS'      // Added for product type compatibility
  | 'nose-pin'
  | 'NOSE-PIN'      // Added for product type compatibility
  | 'ring'
  | 'RINGS'         // Added for product type compatibility
  | 'bracelet'
  | 'BRACELET'      // Added for product type compatibility
  | 'bangles'
  | 'BANGLES'       // Added for product type compatibility
  | 'pendant'
  | 'PENDANT'       // Added for product type compatibility
  | 'NECKLACE'      // Added for product type compatibility
  | 'PENDANTS'      // Added for product type compatibility
  | 'CHAINS'        // Added for product type compatibility
  | 'HARAMS'        // Added for traditional long necklaces
  | 'HIPBELT'       // Added for waist belt support
  | 'MATHAPATTI'    // Added for forehead ornaments
  | 'FOREHEAD';     // Alternative name for Mathapatti

// Define the output structure for our calculations
export interface Placement {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  side?: 'left' | 'right';
}

export type PlacementResult = Placement | Placement[] | null;

/**
 * Calculates the position and size for a jewelry overlay based on landmarks.
 * @param jewelryType The type of jewelry to place.
 * @param landmarks The array of landmarks from MediaPipe.
 * @param canvas The canvas element to draw on.
 * @param image The HTMLImageElement of the jewelry to maintain its aspect ratio.
 * @returns A Placement object, array of Placements, or null if placement is not possible.
 */
export function getJewelryPlacement(
  jewelryType: JewelryType,
  landmarks: NormalizedLandmark[],
  canvas: HTMLCanvasElement,
  image: HTMLImageElement
): PlacementResult {
  
  const getDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark): number => {
    return Math.sqrt(Math.pow((p1.x - p2.x) * canvas.width, 2) + Math.pow((p1.y - p2.y) * canvas.height, 2));
  };

  const imageAspectRatio = image.width / image.height;

  switch (jewelryType) {
    case 'necklace':
    case 'NECKLACE':
    case 'CHAINS':
    case 'HARAMS': {
      // Enhanced necklace positioning using multiple facial landmarks
      const chin = landmarks[152];          // Center of chin
      const leftJaw = landmarks[287];       // Left jaw
      const rightJaw = landmarks[57];       // Right jaw
      const leftNeck = landmarks[150];      // Left neck point
      const rightNeck = landmarks[375];     // Right neck point
      const leftCheek = landmarks[123];     // Left cheek
      const rightCheek = landmarks[352];    // Right cheek

      // Validate required landmarks
      if (!chin || !leftJaw || !rightJaw || !leftNeck || !rightNeck || !leftCheek || !rightCheek) {
        return null;
      }

      // Calculate neck width and position
      const neckWidth = getDistance(leftNeck, rightNeck);
      const cheekWidth = getDistance(leftCheek, rightCheek);
      const jawWidth = getDistance(leftJaw, rightJaw);
      
      // Use the widest measurement to set the scale
      const maxWidth = Math.max(neckWidth, cheekWidth, jawWidth);
      
      // Adjust scale based on jewelry type
      let scaleMultiplier: number;
      let verticalOffset: number;
      
      switch (jewelryType) {
        case 'CHAINS':
          // Chains sit closer to the collarbone and should be slightly smaller / higher
          scaleMultiplier = 2.5;
          verticalOffset = -0.01; // move slightly down from neck center
          break;
        case 'HARAMS':
          // Harams are longer but should start nearer the neck/collarbone.
          // Lower this so the necklace hangs naturally and fits the neck.
          scaleMultiplier = 1.5;   // slightly reduced width for better fit
          verticalOffset = 0.03;   // move DOWN by 6% of canvas height to lower position
          break;
        default:
          // Regular necklaces
          scaleMultiplier = 1.2;
          verticalOffset = 0.01;
      }

      const targetWidth = maxWidth * scaleMultiplier;
      const targetHeight = targetWidth / imageAspectRatio;

      // Calculate center point using multiple landmarks for stability
      const centerX = (
        (leftJaw.x + rightJaw.x) / 2 +
        (leftNeck.x + rightNeck.x) / 2 +
        (leftCheek.x + rightCheek.x) / 2
      ) / 3;

      // Calculate optimal Y position
      const neckY = (leftNeck.y + rightNeck.y) / 2;
      const chinY = chin.y;
      // Give more influence to the chin so heavier/longer necklaces hang lower
      const baseY = (neckY * 0.5 + chinY * 0.5);
      
      return {
        width: targetWidth,
        height: targetHeight,
        x: centerX * canvas.width - targetWidth / 2,
        y: baseY * canvas.height + (canvas.height * verticalOffset),
      };
    }

    case 'earring-left': {
      // Using the CORRECT landmark from the working Python script
      // Landmark 234: Left ear attachment point (where ear meets face)
      const earLobe = landmarks[234];
      
      // Also get the opposite side for face width calculation
      const rightEar = landmarks[454];
      
      if (!earLobe || !rightEar) return null;
      
      // Calculate face width for proportional sizing (matching Python script approach)
      const faceWidth = getDistance(earLobe, rightEar);
      
      // Size calculation matching Python: face_width / 700.0
      // Converting to canvas pixels and creating proper aspect ratio
      const scale = faceWidth / 1000.0;
      const targetWidth = image.width * scale;
      const targetHeight = image.height * scale;
      
      // Position earring so it HANGS from the ear lobe
      // The TOP of the earring image should be at the lobe point
      // X: centered on the ear lobe with slight inward offset
      // Y: offset down from the ear attachment to reach the actual lobe
      const X_OFFSET_LEFT = -5;  // Slight inward adjustment (in pixels)
      const Y_OFFSET = 15;        // Move DOWN to the earlobe (matching Python script)
      
      return {
        width: targetWidth,
        height: targetHeight,
        x: earLobe.x * canvas.width - targetWidth / 2 + X_OFFSET_LEFT,
        y: earLobe.y * canvas.height + Y_OFFSET, // Move down to actual earlobe position
      };
    }
      
    case 'earring-right': {
      // Using the CORRECT landmark from the working Python script
      // Landmark 454: Right ear attachment point (where ear meets face)
      const earLobe = landmarks[454];
      
      // Also get the opposite side for face width calculation
      const leftEar = landmarks[234];
      
      if (!earLobe || !leftEar) return null;
      
      // Calculate face width for proportional sizing (matching Python script approach)
      const faceWidth = getDistance(leftEar, earLobe);
      
      // Size calculation matching Python: face_width / 700.0
      // Converting to canvas pixels and creating proper aspect ratio
      const scale = faceWidth / 1000.0;
      const targetWidth = image.width * scale;
      const targetHeight = image.height * scale;
      
      // Position earring so it HANGS from the ear lobe
      // The TOP of the earring image should be at the lobe point
      // X: centered on the ear lobe with slight inward offset
      // Y: offset down from the ear attachment to reach the actual lobe
      const X_OFFSET_RIGHT = 5;   // Slight inward adjustment (in pixels)
      const Y_OFFSET = 15;         // Move DOWN to the earlobe (matching Python script)
      
      return {
        width: targetWidth,
        height: targetHeight,
        x: earLobe.x * canvas.width - targetWidth / 2 + X_OFFSET_RIGHT,
        y: earLobe.y * canvas.height + Y_OFFSET, // Move down to actual earlobe position
      };
    }

    case 'nose-pin':
    case 'NOSE-PIN': {
      // Using the best landmarks for nostril placement
      const leftNostril = landmarks[98];    // Left nose wing/ala
      const rightNostril = landmarks[327];  // Right nose wing/ala
      
      // Default to left nostril
      const nostril = leftNostril;
      
      if (!nostril) return null;
      
      const noseTip = landmarks[1];
      const noseBridge = landmarks[6];
      if(!noseTip || !noseBridge) return null;

      const noseLength = getDistance(noseTip, noseBridge);
      
      // Perfect size - keeping as is
      const targetWidth = noseLength * 0.65;
      const targetHeight = targetWidth / imageAspectRatio;

      // Position adjustments - MOVE to the right side (toward the nostril)
      const X_OFFSET = 15;   // CHANGED from -12 to +15 (positive moves RIGHT on screen)
      const Y_OFFSET = -24;  // Keep the vertical position

      return {
        width: targetWidth,
        height: targetHeight,
        x: nostril.x * canvas.width - targetWidth / 2 + X_OFFSET,
        y: nostril.y * canvas.height - targetHeight / 2 + Y_OFFSET,
      };
    }
      
    case 'ring':
    case 'RINGS': {
      const fingerTip = landmarks[6];  
      const fingerBase = landmarks[5]; 
      
      if (!fingerTip || !fingerBase) return null;
      
      const fingerWidth = getDistance(fingerTip, fingerBase);
      const targetWidth = fingerWidth * 0.8;
      const targetHeight = targetWidth / imageAspectRatio;
      
      // Calculate offset to move ring down to BASE knuckle position
      const fingerLength = getDistance(fingerTip, fingerBase);
      const downwardOffset = fingerLength * 0.3; // ← INCREASE from 0.3 to 0.6
      
      return {
        width: targetWidth,
        height: targetHeight,
        x: fingerTip.x * canvas.width - targetWidth / 2,
        y: fingerTip.y * canvas.height - targetHeight / 2 + downwardOffset
      };
    }
    
    case 'bracelet':
    case 'BRACELET': {
      // For bracelets, use wrist landmarks
      const wristBase = landmarks[0]; // Landmark 0 is typically the base of the wrist
      const pinkyKnuckle = landmarks[17]; // Landmark 17 is near the pinky knuckle
      const indexKnuckle = landmarks[5];  // Landmark 5 is near the index finger knuckle

      // Need at least the wrist base and one knuckle for width estimate
      if (!wristBase || (!pinkyKnuckle && !indexKnuckle)) return null;

      // Use available knuckles to estimate hand width near the wrist
      let handWidthEstimate: number;
      if (pinkyKnuckle && indexKnuckle) {
          handWidthEstimate = getDistance(pinkyKnuckle, indexKnuckle);
      } else if (pinkyKnuckle) {
          // Estimate width based on wrist-to-pinky distance (less accurate)
          handWidthEstimate = getDistance(wristBase, pinkyKnuckle) * 1.5; // Adjust multiplier as needed
      } else if (indexKnuckle) {
           // Estimate width based on wrist-to-index distance (less accurate)
          handWidthEstimate = getDistance(wristBase, indexKnuckle) * 1.5; // Adjust multiplier as needed
      } else {
          return null; // Should not happen if initial check passed
      }

      // --- ADJUSTMENTS ---
      // 1. Increase scale multiplier to make it wider ("cover the hand")
      const scaleMultiplier = 1.4; // Increased from 1.2, adjust as needed
      // 2. Define a vertical offset to move it lower (positive value moves down)
      const verticalOffsetRatio = 0.05; // Move down by 5% of canvas height, adjust as needed
      // -----------------

      const targetWidth = handWidthEstimate * scaleMultiplier;
      const targetHeight = targetWidth / imageAspectRatio; // Maintain aspect ratio

      // Calculate the center X based on available landmarks
      let centerX: number;
      if (pinkyKnuckle && indexKnuckle) {
        centerX = ((pinkyKnuckle.x + indexKnuckle.x) / 2);
      } else {
        // Fallback to wrist base X if only one knuckle is available
        centerX = wristBase.x;
      }
      
      // Calculate the base Y position using the wrist landmark
      const baseY = wristBase.y * canvas.height;

      // Apply the vertical offset
      const finalY = baseY + (canvas.height * verticalOffsetRatio) - targetHeight / 2; // Subtract half height to keep it centered vertically around the offset point

      return {
        width: targetWidth,
        height: targetHeight,
        x: centerX * canvas.width - targetWidth / 2, // Center horizontally
        y: finalY // Apply the calculated Y position with offset
      };
    }
    case 'bangles':
    case 'BANGLES': {
      // Enhanced bangle positioning with support for both wrists
      const leftWrist = landmarks[0];  // Left wrist point
      const rightWrist = landmarks[17]; // Right wrist point
      const leftForearm = landmarks[1]; // Left forearm point for angle
      const rightForearm = landmarks[18]; // Right forearm point for angle
      
      if (!leftWrist || !rightWrist || !leftForearm || !rightForearm) return null;
      
      const wristWidth = getDistance(leftWrist, rightWrist);
      // Make bangles slightly larger than bracelets for a looser fit
      const targetWidth = wristWidth * 1.6;
      const targetHeight = targetWidth / imageAspectRatio;
      
      // Calculate the angle of the forearm for better bangle orientation
      const leftAngle = Math.atan2(
        leftForearm.y - leftWrist.y,
        leftForearm.x - leftWrist.x
      );
      const rightAngle = Math.atan2(
        rightForearm.y - rightWrist.y,
        rightForearm.x - rightWrist.x
      );
      
      // Return positions for both wrists
      return [
        {
          // Left wrist placement
          width: targetWidth,
          height: targetHeight,
          x: leftWrist.x * canvas.width - targetWidth / 2,
          y: leftWrist.y * canvas.height - targetHeight / 2,
          rotation: leftAngle,
          side: 'left'
        },
        {
          // Right wrist placement
          width: targetWidth,
          height: targetHeight,
          x: rightWrist.x * canvas.width - targetWidth / 2,
          y: rightWrist.y * canvas.height - targetHeight / 2,
          rotation: rightAngle,
          side: 'right'
        }
      ];
    }

    case 'pendant':
    case 'PENDANT':
    case 'PENDANTS': {
      // Enhanced pendant positioning using facial landmarks
      const chin = landmarks[152];          // Center of chin
      const leftJaw = landmarks[287];       // Left jaw
      const rightJaw = landmarks[57];       // Right jaw
      const leftNeck = landmarks[147];      // Left neck point
      const rightNeck = landmarks[377];     // Right neck point
      const leftCheek = landmarks[123];     // Left cheek
      const rightCheek = landmarks[352];    // Right cheek

      if (!chin || !leftJaw || !rightJaw || !leftNeck || !rightNeck) return null;

      // Calculate neck width and position
      const neckWidth = getDistance(leftNeck, rightNeck);
      const cheekWidth = getDistance(leftCheek, rightCheek);
      const jawWidth = getDistance(leftJaw, rightJaw);
      
      // Use the widest measurement to set the scale
      const maxWidth = Math.max(neckWidth, cheekWidth, jawWidth);
      
      // INCREASED size - make pendant more visible
      const scaleMultiplier = 1.5;  // CHANGED from 0.4 to 0.6 (50% bigger)
      const verticalOffset = 0.03;  // ADJUSTED - middle position between too high and too low
      
      const targetWidth = maxWidth * scaleMultiplier;
      const targetHeight = targetWidth / imageAspectRatio;

      // Calculate center point using multiple landmarks for stability
      const centerX = (
        (leftJaw.x + rightJaw.x) / 2 +
        (leftNeck.x + rightNeck.x) / 2 +
        (leftCheek.x + rightCheek.x) / 2
      ) / 3;

      // Calculate optimal Y position - balanced between neck and chin
      const neckY = (leftNeck.y + rightNeck.y) / 2;
      const chinY = chin.y;
      const baseY = (neckY * 0.6 + chinY * 0.4); // BALANCED: 60% neck, 40% chin

      return {
        width: targetWidth,
        height: targetHeight,
        x: centerX * canvas.width - targetWidth / 2,
        y: baseY * canvas.height + (canvas.height * verticalOffset)
      };
    }
    
    case 'HIPBELT': {
      // For waist belt, use hip landmarks
      const leftHip = landmarks[23];  // Left hip landmark
      const rightHip = landmarks[24]; // Right hip landmark

      if (!leftHip || !rightHip) return null;

      // Assuming getDistance returns a pixel-based distance.
      // If it returns normalized distance, you'll need to multiply by canvas.width.
      // Let's assume hipWidth is in pixels for this example.
      const hipWidth = getDistance(leftHip, rightHip);
      const targetWidth = hipWidth * 2;
      const targetHeight = targetWidth / imageAspectRatio;

      // --- START: Vertical Offset Control ---
      //
      // Create an offset to move the belt up or down.
      // This offset is in pixels.
      //
      //   * A NEGATIVE value moves the belt UP (e.g., -50)
      //   * A POSITIVE value moves the belt DOWN (e.g., 50)
      //
      // Using a value relative to hipWidth makes it scale with the user's size.
      // (e.g., -hipWidth * 0.2 moves it up by 20% of the hip width)
      
      const verticalOffset = -hipWidth * 0.6; // <-- ADJUST THIS VALUE
      
      // Example: To move UP, use a negative value:
      // const verticalOffset = -hipWidth * 0.2; // Moves up by 20% of hip width
      
      // Example: To move DOWN, use a positive value:
      // const verticalOffset = hipWidth * 0.1; // Moves down by 10% of hip width

      // Example: To use a fixed pixel value:
      // const verticalOffset = -40; // Moves up by 40 pixels
      //
      // --- END: Vertical Offset Control ---

      const midHipY = ((leftHip.y + rightHip.y) / 2) * canvas.height;
      
      return {
        width: targetWidth,
        height: targetHeight,
        x: ((leftHip.x + rightHip.x) / 2) * canvas.width - targetWidth / 2,
        
        // We add the verticalOffset to the final 'y' calculation
        y: midHipY - targetHeight / 2 + verticalOffset
      };
    }

    case 'MATHAPATTI':
    case 'FOREHEAD': {
      // Use forehead landmarks for placement
      const foreheadLeft = landmarks[108];  // Left forehead point
      const foreheadRight = landmarks[337]; // Right forehead point
      const foreheadCenter = landmarks[151]; // Center forehead point
      
      if (!foreheadLeft || !foreheadRight || !foreheadCenter) return null;
      
      const foreheadWidth = getDistance(foreheadLeft, foreheadRight);
      // Make the ornament slightly wider than the forehead for the side chains
      const targetWidth = foreheadWidth * 2.6;
      const targetHeight = targetWidth / imageAspectRatio;
      
      // Place it slightly higher than the center point for better aesthetics
      const verticalOffset = canvas.height * 0.05;
      
      return {
        width: targetWidth,
        height: targetHeight,
        x: ((foreheadLeft.x + foreheadRight.x) / 2) * canvas.width - targetWidth / 2,
        y: foreheadCenter.y * canvas.height - verticalOffset - targetHeight / 2
      };
    }

    default:
      return null;
  }
}
