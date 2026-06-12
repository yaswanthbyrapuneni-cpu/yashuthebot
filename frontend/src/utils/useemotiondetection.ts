import { useEffect, useRef, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { analyzeEmotion } from '../utils/emotion-tracking';

interface EmotionSample {
  emotion: 'happy' | 'neutral' | 'sad';
  confidence: number;
  timestamp: number;
}

interface UseEmotionDetectionProps {
  videoElement: HTMLVideoElement | null;
  productId: string;
  productName: string;
  isActive: boolean; // Is try-on modal active?
  faceDetected: boolean; // Is face currently detected in frame?
  onSessionEnd?: (samples: EmotionSample[], productId: string, productName: string) => void; // Called when modal closes
}

export function useEmotionDetection({
  videoElement,
  productId,
  productName,
  isActive,
  faceDetected,
  onSessionEnd,
}: UseEmotionDetectionProps) {
  
  // Track active wear time (in seconds)
  const [activeWearTime, setActiveWearTime] = useState(0);
  
  // Refs
  const samplesRef = useRef<EmotionSample[]>([]);
  const samplingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackedProductRef = useRef<string>('');
  const lastSampleTimeRef = useRef<number>(0);
  const faceDetectedRef = useRef<boolean>(false);
  const onSessionEndRef = useRef<typeof onSessionEnd>(onSessionEnd);

  // Update ref when callback changes
  useEffect(() => {
    onSessionEndRef.current = onSessionEnd;
  }, [onSessionEnd]);

  // Reset when product changes
  useEffect(() => {
    if (trackedProductRef.current !== productId) {
      console.log('[EmotionDetection] New product detected:', productId);
      
      // Clear old intervals
      if (samplingIntervalRef.current) clearInterval(samplingIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      // Reset state
      trackedProductRef.current = productId;
      samplesRef.current = [];
      setActiveWearTime(0);
      lastSampleTimeRef.current = 0;
    }
  }, [productId]);

  // Update ref when faceDetected changes
  useEffect(() => {
    faceDetectedRef.current = faceDetected;
  }, [faceDetected]);

  // Handle session end (when modal closes)
  useEffect(() => {
    // When modal closes and we have samples, trigger session end
    if (!isActive && samplesRef.current.length > 0 && onSessionEndRef.current) {
      console.log('[EmotionDetection] Session ended with', samplesRef.current.length, 'samples');
      onSessionEndRef.current(samplesRef.current, productId, productName);
      
      // Clear samples for next session
      samplesRef.current = [];
      setActiveWearTime(0);
    }
  }, [isActive, productId, productName]);

  // Main emotion detection logic
  useEffect(() => {
    // Don't run if modal not active or no video element
    if (!isActive || !videoElement) {
      return;
    }

    console.log('[EmotionDetection] Starting continuous sampling for:', productId);

    // Start emotion sampling every 1 second (non-blocking, async)
    samplingIntervalRef.current = setInterval(() => {
      // Only sample if face is detected
      if (!faceDetectedRef.current) {
        return;
      }

      const now = Date.now();
      const timeSinceLastSample = now - lastSampleTimeRef.current;
      
      // Ensure we don't sample too frequently (minimum 800ms gap)
      if (timeSinceLastSample < 800) {
        return;
      }

      // Fire-and-forget async emotion capture (doesn't block timer)
      (async () => {
        try {
          const result = await analyzeEmotion(videoElement);
          
          const sample: EmotionSample = {
            emotion: result.emotion,
            confidence: result.confidence,
            timestamp: Date.now(),
          };

          samplesRef.current.push(sample);
          lastSampleTimeRef.current = Date.now();
          
          console.log('[EmotionDetection] Sample', samplesRef.current.length, ':', sample.emotion, sample.confidence.toFixed(2));
          
          // Save to Supabase immediately
          try {
            const { error } = await supabase
              .from('emotion_samples')
              .insert({
                product_id: productId,
                emotion: sample.emotion,
                confidence: sample.confidence,
                kiosk_id: import.meta.env.VITE_KIOSK_ID || 'KIOSK_001',
                timestamp: new Date(sample.timestamp).toISOString(),
              });
            
            if (error) {
              console.error('[EmotionDetection] Supabase insert error:', error);
            }
          } catch (dbError) {
            console.error('[EmotionDetection] Database error:', dbError);
          }
          
        } catch (error) {
          console.warn('[EmotionDetection] Sample failed:', error);
        }
      })();
    }, 1000); // Every 1 second

    // Start timer (increments every second when face detected)
    timerIntervalRef.current = setInterval(() => {
      if (faceDetectedRef.current) {
        setActiveWearTime(prev => {
          const newTime = prev + 1;
          
          // Only log every 5 seconds to reduce console spam
          if (newTime % 5 === 0) {
            console.log('[EmotionDetection] Active wear time:', newTime, 'seconds');
          }
          
          return newTime;
        });
      }
    }, 1000); // Every 1 second

    // Cleanup
    return () => {
      if (samplingIntervalRef.current) clearInterval(samplingIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, videoElement, productId, productName]);

  // 🔥 FIX: Add getSamples function to return current samples
  const getSamples = () => {
    console.log('[EmotionDetection] getSamples() called, returning', samplesRef.current.length, 'samples');
    return [...samplesRef.current]; // Return a copy
  };

  return {
    activeWearTime,
    samplesCollected: samplesRef.current.length,
    getSamples, // 🔥 Export the getSamples function
  };
}

// Helper function to calculate dominant emotion from samples
export function calculateDominantEmotion(samples: EmotionSample[]): {
  dominantEmotion: string;
  emotionCounts: Record<string, number>;
  totalSamples: number;
} {
  if (samples.length === 0) {
    return {
      dominantEmotion: 'unknown',
      emotionCounts: {},
      totalSamples: 0,
    };
  }

  // Count occurrences of each emotion
  const emotionCounts: Record<string, number> = {};
  
  samples.forEach(sample => {
    emotionCounts[sample.emotion] = (emotionCounts[sample.emotion] || 0) + 1;
  });

  // Find the emotion with highest count
  let dominantEmotion = 'unknown';
  let maxCount = 0;

  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantEmotion = emotion;
    }
  });

  console.log('[EmotionDetection] Dominant emotion:', dominantEmotion, 'from', samples.length, 'samples');
  console.log('[EmotionDetection] Emotion breakdown:', emotionCounts);

  return {
    dominantEmotion,
    emotionCounts,
    totalSamples: samples.length,
  };
}