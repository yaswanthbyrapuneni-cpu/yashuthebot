import { DetectorType } from "../detectors/DetectorManager";
import type { JewelryType } from "./jewelry-positioner";

// Map jewelry types to their required detectors
const jewelryToDetectorMap: Record<JewelryType, DetectorType> = {
  'necklace': 'face',
  'NECKLACE': 'face',
  'CHAINS': 'face',
  'HARAMS': 'face',
  'pendant': 'face',
  'PENDANT': 'face',
  'PENDANTS': 'face',
  'earring-left': 'face',
  'earring-right': 'face',
  'earrings': 'face',
  'EARRINGS': 'face',
  'nose-pin': 'face',
  'NOSE-PIN': 'face',
  'ring': 'hands',
  'RINGS': 'hands',
  'bracelet': 'hands',
  'BRACELET': 'hands',
  'bangles': 'hands',
  'BANGLES': 'hands',
  'HIPBELT': 'pose',
  'MATHAPATTI': 'face',
  'FOREHEAD': 'face'
};

/**
 * Get the appropriate detector type for a given jewelry type.
 * @param {JewelryType} jewelryType - The type of jewelry being tried on
 * @returns {DetectorType} The corresponding detector to use
 */
export function getDetectorForJewelry(jewelryType: JewelryType): DetectorType {
  const detector = jewelryToDetectorMap[jewelryType];
  if (!detector) {
    console.warn(`No detector configured for jewelry type: ${jewelryType}. Defaulting to 'face'.`);
    return 'face';
  }
  return detector;
}
