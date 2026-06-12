## 1. Abstract and Purpose of Software

Project: <project_name>  
Version: <project_version>  
Author: <applicant_full_name>  
Organization: NRDC  
Purpose: Intellectual Property Registration (NRDC)

This software is a lightweight HTTP microservice to perform emotion detection on images using the DeepFace library. It exposes a simple REST endpoint `/detect-emotion` that accepts a base64-encoded image and returns a mapped emotion (happy, neutral, sad) with a confidence score and processing timing.

## 2. System Architecture and Modules

- `app.py` — Flask application. Endpoints:
  - `GET /health` — simple health check
  - `POST /detect-emotion` — accepts JSON { "image": "data:image/jpeg;base64,..." } and returns emotion result

- `test_live.py` — Client/demo script to capture webcam frames with OpenCV, send to the API, and display results.

Deployment: Single-process Flask service intended to run behind a process manager or container. Relies on DeepFace and underlying ML backends for inference.

## 3. Functional Description

Behavioral flow:
1. Client encodes image into data URL format and POSTs to `/detect-emotion`.
2. Server decodes base64 to bytes, loads image with PIL, ensures RGB, and converts to numpy array.
3. Server calls `DeepFace.analyze(img_path=img_array, actions=['emotion'], enforce_detection=False, detector_backend='opencv')`.
4. DeepFace returns a dictionary of emotion strengths. The server maps those to three categories:
   - `happy` directly from the `happy` score
   - `neutral` directly from the `neutral` score
   - `sad` combined heuristic of `sad + 0.5*angry + 0.3*fear`
5. Server returns JSON: `{ "emotion": "<dominant>", "confidence": <0-1>, "processing_time_ms": <ms> }`.

## 4. Source Code Metadata and Originality

Files included in the submission (content excerpts and metadata):

- `app.py` — core service (custom glue code).  
- `test_live.py` — demo/test harness (custom)  
- `requirements.txt` — dependency list (third-party)

Verification: To produce reproducible artifact metadata (SHA-256, size, line counts) run this Python snippet from the project root and include outputs with the NRDC package:

```python
import os, hashlib, json
files = ['app.py','requirements.txt','test_live.py']
meta = []
for f in files:
    with open(f, 'rb') as fh:
        data = fh.read()
    sha = hashlib.sha256(data).hexdigest()
    size = len(data)
    try:
        text = data.decode('utf-8')
        lines = text.count('\n') + (1 if text and not text.endswith('\n') else 0)
    except:
        lines = data.count(b'\n') + 1 if size>0 else 0
    meta.append({'path': f, 'sha256': sha, 'size_bytes': size, 'lines': lines})
print(json.dumps({'files': meta}, indent=2))
```

Include the printed JSON in the submission where NRDC requests a source listing with checksums. If you want, I can run this locally (requires permission) to embed exact checksums into `code_audit_summary.json`.

Third-party components (detected in `requirements.txt`) — verify licenses and include copies or references for each dependency in your NRDC package:

- deepface  
- flask  
- flask-cors  
- pillow  
- numpy  
- opencv-python-headless  
- tf-keras

Note: Do not claim the DeepFace source or model weights as original; they are third-party. The original claim should be limited to the glue code and any documentation authored by you.

## 5. Author and Ownership Declaration

I, <applicant_full_name>, declare that I am the author of the original source files in this submission and hold the rights to submit them to NRDC. The submission contains original code written by me and includes third-party dependencies which are explicitly listed in `requirements.txt`. I have included (or will include) license references for those third-party components and will ensure proper attribution where required.

Signature: ____________________  Date: ____________________
