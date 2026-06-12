// Simple helper to capture frame and analyze emotion
export async function analyzeEmotion(videoElement: HTMLVideoElement) {
  try {
    console.log('[Emotion] Starting capture...');
    
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context failed');
    
    console.log('[Emotion] Drawing frame...');
    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0);
    
    console.log('[Emotion] Converting to base64...');
    // Convert to base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    console.log('[Emotion] Sending to API...');
    // Send to Flask API
    const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL ?? 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/detect-emotion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });
    
    console.log('[Emotion] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Emotion] API error:', errorText);
      throw new Error(`API failed: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('[Emotion] Result:', result);
    return result;
  } catch (error) {
    console.error('[Emotion] Full error:', error);
    throw error;
  }
}
