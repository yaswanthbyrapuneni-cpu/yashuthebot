from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import logging
import requests
import google.auth
import google.auth.transport.requests
from google.oauth2 import service_account
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

VERTEX_PROJECT_ID = os.getenv('VERTEX_PROJECT_ID', 'project-bc9ba853-ede2-43c2-a3e')
VERTEX_REGION = os.getenv('VERTEX_REGION', 'us-central1')

_vertex_credentials = None

def get_vertex_access_token():
    global _vertex_credentials
    try:
        if _vertex_credentials is None:
            creds_json = os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON')
            if creds_json:
                creds_dict = json.loads(creds_json)
                _vertex_credentials = service_account.Credentials.from_service_account_info(
                    creds_dict,
                    scopes=['https://www.googleapis.com/auth/cloud-platform']
                )
            else:
                _vertex_credentials, _ = google.auth.default(
                    scopes=['https://www.googleapis.com/auth/cloud-platform']
                )
        auth_req = google.auth.transport.requests.Request()
        _vertex_credentials.refresh(auth_req)
        return _vertex_credentials.token
    except google.auth.exceptions.DefaultCredentialsError:
        raise RuntimeError(
            "No Application Default Credentials found. "
            "Run: gcloud auth application-default login"
        )


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'vastra-alankara-backend'}), 200


@app.route('/try-on', methods=['POST'])
def try_on():
    """
    Virtual try-on using Vertex AI.

    Request JSON:
    {
        "person_image": "data:image/jpeg;base64,...",
        "garment_image": "data:image/jpeg;base64,..."
    }

    Response:
    {
        "success": true,
        "result_image": "data:image/png;base64,..."
    }
    """
    try:
        data = request.json
        if not data or 'person_image' not in data or 'garment_image' not in data:
            return jsonify({'success': False, 'error': 'Missing person_image or garment_image'}), 400

        def extract_base64(data_url):
            return data_url.split(',')[1] if ',' in data_url else data_url

        person_b64 = extract_base64(data['person_image'])
        garment_b64 = extract_base64(data['garment_image'])

        logger.info("Starting virtual try-on via Vertex AI")

        access_token = get_vertex_access_token()

        url = (
            f"https://{VERTEX_REGION}-aiplatform.googleapis.com/v1"
            f"/projects/{VERTEX_PROJECT_ID}/locations/{VERTEX_REGION}"
            f"/publishers/google/models/virtual-try-on-001:predict"
        )

        payload = {
            "instances": [{
                "personImage": {
                    "image": {"bytesBase64Encoded": person_b64}
                },
                "productImages": [{
                    "image": {"bytesBase64Encoded": garment_b64}
                }]
            }],
            "parameters": {"sampleCount": 1}
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers, timeout=60)
        response.raise_for_status()

        result = response.json()
        predictions = result.get('predictions', [])
        if not predictions:
            return jsonify({'success': False, 'error': 'No predictions returned from Vertex AI'}), 500

        pred = predictions[0]
        result_b64 = (
            pred.get('bytesBase64Encoded') or
            pred.get('image', {}).get('bytesBase64Encoded', '')
        )
        mime_type = pred.get('mimeType', 'image/png')

        if not result_b64:
            return jsonify({'success': False, 'error': 'Empty result from Vertex AI'}), 500

        logger.info("Try-on generated successfully")
        return jsonify({
            'success': True,
            'result_image': f"data:{mime_type};base64,{result_b64}"
        }), 200

    except RuntimeError as e:
        logger.error(f"Vertex AI auth error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    except requests.exceptions.HTTPError as e:
        logger.error(f"Vertex AI HTTP error: {e.response.text}")
        return jsonify({'success': False, 'error': f"Vertex AI error: {e.response.status_code}"}), 500
    except Exception as e:
        logger.error(f"Try-on error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
