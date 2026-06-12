# Central Submission Package

Project: <project_name>
Version: <project_version>
Author: <applicant_full_name>
Organization: NRDC

This single-file bundle contains the complete application source (start-to-end) and supporting documents intended for submission to NRDC. It is designed so that reviewers can view the entire code and required documentation in one place. Do not include other internal repositories when submitting this file.

---

## 1) Complete application source (app.py)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import logging
import os
import time
from PIL import Image
import numpy as np
from deepface import DeepFace

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'deepface-emotion-detector'
    }), 200

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    """
    Detect emotion from base64 encoded image
    
    Expected: { "image": "data:image/jpeg;base64,..." }
    Returns: { "emotion": "happy|neutral|sad", "confidence": 0.85 }
    """
    start_time = time.time()
    
    try:
        if not request.json or 'image' not in request.json:
            return jsonify({'error': 'Missing image data'}), 400
        
        # Decode base64 image
        img_data_url = request.json['image']
        img_base64 = img_data_url.split(',')[1] if ',' in img_data_url else img_data_url
        
        img_bytes = base64.b64decode(img_base64)
        img = Image.open(io.BytesIO(img_bytes))
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img_array = np.array(img)
        
        # Analyze with DeepFace
        result = DeepFace.analyze(
            img_path=img_array,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='opencv',
            silent=True
        )
        
        if isinstance(result, list):
            result = result[0]
        
        emotions = result.get('emotion', {})
        
        # Map to 3 categories: happy, neutral, sad
        emotion_mapping = {
            'happy': emotions.get('happy', 0),
            'neutral': emotions.get('neutral', 0),
            'sad': (
                emotions.get('sad', 0) + 
                emotions.get('angry', 0) * 0.5 + 
                emotions.get('fear', 0) * 0.3
            )
        }
        
        # Get dominant emotion
        dominant_emotion = max(emotion_mapping, key=emotion_mapping.get)
        confidence = emotion_mapping[dominant_emotion] / 100
        
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        logger.info(f"Emotion: {dominant_emotion} ({confidence:.2f}) - {processing_time}ms")
        
        return jsonify({
            'emotion': dominant_emotion,
            'confidence': confidence,
            'processing_time_ms': processing_time
        }), 200
        
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({
            'emotion': 'neutral',
            'confidence': 0.5,
            'error': str(e)
        }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"🚀 Starting on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
```

---

## 2) Demo / test harness (test_live.py)

```python
import cv2
import base64
import requests
import time
import json

# API endpoint
API_URL = "http://127.0.0.1:5000/detect-emotion"

def capture_and_detect():
    """Capture from webcam and detect emotions"""
    
    # Open webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Error: Could not open webcam")
        return
    
    print("✅ Webcam opened successfully")
    print("📸 Capturing every 2 seconds...")
    print("Press 'q' to quit\n")
    
    last_detection_time = 0
    current_emotion = "Starting..."
    confidence = 0
    
    while True:
        ret, frame = cap.read()
        
        if not ret:
            print("❌ Failed to grab frame")
            break
        
        # Detect emotion every 2 seconds
        current_time = time.time()
        if current_time - last_detection_time >= 2:
            last_detection_time = current_time
            
            # Encode frame to base64
            _, buffer = cv2.imencode('.jpg', frame)
            img_base64 = base64.b64encode(buffer).decode('utf-8')
            img_data_url = f"data:image/jpeg;base64,{img_base64}"
            
            # Send to API
            try:
                print("🔄 Sending frame to API...")
                start = time.time()
                
                response = requests.post(
                    API_URL,
                    json={"image": img_data_url},
                    timeout=5
                )
                
                elapsed = round((time.time() - start) * 1000, 2)
                
                if response.status_code == 200:
                    result = response.json()
                    current_emotion = result['emotion']
                    confidence = result['confidence']
                    processing_time = result.get('processing_time_ms', 0)
                    
                    print(f"✅ Emotion: {current_emotion.upper()} (confidence: {confidence:.2f})")
                    print(f"   Network: {elapsed}ms | Processing: {processing_time}ms")
                    print(f"   Total: {elapsed + processing_time}ms\n")
                else:
                    print(f"❌ API Error: {response.status_code}")
                    
            except requests.exceptions.Timeout:
                print("❌ Request timeout")
            except Exception as e:
                print(f"❌ Error: {e}")
        
        # Display emotion on frame
        cv2.putText(
            frame, 
            f"Emotion: {current_emotion} ({confidence:.2f})", 
            (10, 30), 
            cv2.FONT_HERSHEY_SIMPLEX, 
            0.7, 
            (0, 255, 0), 
            2
        )
        
        # Show frame
        cv2.imshow('Emotion Detection Test - Press Q to quit', frame)
        
        # Quit on 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    print("\n✅ Test completed!")

if __name__ == "__main__":
    print("="*50)
    print("🎭 DeepFace Emotion Detection - Live Test")
    print("="*50)
    capture_and_detect()
```

---

## 3) Requirements

```
flask==3.0.0
flask-cors==4.0.0
deepface
pillow
numpy
opencv-python-headless
tf-keras
```

---

## 4) Included documentation (copied below)

### NRDC central code document

(See `nrdc_central_code_document.md` in this folder.)

### Originality statement

(See `originality_statement.txt` in this folder.)

### Compliance checklist

(See `nrdc_guideline_compliance.json` in this folder.)

---

End of central submission package.
