from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import logging
import os
import time
import requests
import google.auth
import google.auth.transport.requests
from PIL import Image
import numpy as np
from deepface import DeepFace
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# ==================== ENVIRONMENT VARIABLES ====================
OWNER_EMAIL = os.getenv('OWNER_EMAIL')
OWNER_PHONE = os.getenv('OWNER_PHONE')
ALERT_EMAIL = os.getenv('ALERT_EMAIL', OWNER_EMAIL)  # Email to receive alerts (defaults to OWNER_EMAIL if not set)
SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASS = os.getenv('SMTP_PASS')
# ======== HARD-CODED TWILIO CONFIG ========
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
# ======== SUPABASE CONFIG ========
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
# ======== VERTEX AI CONFIG ========
VERTEX_PROJECT_ID = os.getenv('VERTEX_PROJECT_ID', 'project-eb92001c-afbb-4c36-a5a')
VERTEX_REGION = os.getenv('VERTEX_REGION', 'us-central1')
GCLOUD_PATH = os.getenv('GCLOUD_PATH', 'gcloud')

# Initialize Supabase client with service role key
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    logger.info("✅ Supabase client initialized")
except Exception as e:
    logger.error(f"❌ Failed to initialize Supabase: {e}")
    supabase = None




# ==================== EXISTING EMOTION DETECTION ====================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'alankara-ai-backend',
        'endpoints': ['/detect-emotion', '/send-alert', '/security-test', '/send-campaign-emails', '/try-on-saree']
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
            'happy': float(emotions.get('happy', 0)),
            'neutral': float(emotions.get('neutral', 0)),
            'sad': float(
                emotions.get('sad', 0) + 
                emotions.get('angry', 0) * 0.5 + 
                emotions.get('fear', 0) * 0.3
            )
        }
        
        # Get dominant emotion
        dominant_emotion = max(emotion_mapping, key=emotion_mapping.get)
        confidence = round(emotion_mapping[dominant_emotion], 2)
        
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        logger.info(f"Emotion: {dominant_emotion} ({confidence}%) - {processing_time}ms")
        
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

# ==================== NEW SECURITY ALERT FUNCTIONALITY ====================

def send_email_alert(detection_type, image_base64, timestamp):
    """
    Send email alert with security image
    
    Args:
        detection_type: 'motion' or 'face'
        image_base64: Base64 encoded image
        timestamp: ISO timestamp string
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        from email.mime.image import MIMEImage
        
        if not all([SMTP_USER, SMTP_PASS, ALERT_EMAIL]):
            logger.error("❌ Email configuration missing")
            return False
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = ALERT_EMAIL  # ✅ Fixed: Now sends to ALERT_EMAIL instead of OWNER_EMAIL
        msg['Subject'] = f"🚨 Security Alert - {'Face Detected' if detection_type == 'face' else 'Motion Detected'}"
        
        # Email body
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #d32f2f;">🚨 Security Alert</h2>
            <p><strong>Alert Type:</strong> {detection_type.upper()} DETECTED</p>
            <p><strong>Time:</strong> {timestamp}</p>
            <p><strong>Location:</strong> Alankara AI Kiosk</p>
            <hr>
            <p>{"⚠️ <strong>Intruder Alert:</strong> A face has been detected at your kiosk location." if detection_type == 'face' else "ℹ️ Motion has been detected at your kiosk location."}</p>
            <p>Please check the attached image and take appropriate action if necessary.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
                This is an automated alert from your Alankara AI Security System.
            </p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Attach image
        try:
            img_data = image_base64.split(',')[1] if ',' in image_base64 else image_base64
            img_bytes = base64.b64decode(img_data)
            
            image = MIMEImage(img_bytes, name=f"security_{detection_type}_{timestamp.replace(':', '-')}.jpg")
            msg.attach(image)
        except Exception as img_error:
            logger.error(f"⚠️ Error attaching image: {img_error}")
        
        # Send email
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
        server.quit()
        
        logger.info(f"✅ Email sent successfully to {ALERT_EMAIL}")  # ✅ Fixed: Log shows correct recipient
        return True
        
    except Exception as e:
        logger.error(f"❌ Email error: {e}")
        return False

def make_twilio_call(detection_type):
    """
    Make Twilio voice call to owner
    
    Args:
        detection_type: 'motion' or 'face'
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, OWNER_PHONE]):
            logger.warning("⚠️ Twilio configuration missing - skipping call")
            return False
        
        from twilio.rest import Client
        
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Voice message based on detection type
        if detection_type == 'face':
            message = "Alert! There is someone intruding in your office. Please check your Alankara AI kiosk immediately."
        else:
            message = "Security alert. Motion has been detected at your Alankara AI kiosk location."
        
        # Create TwiML for voice message
        twiml = f"""
        <Response>
            <Say voice="alice" language="en-US">{message}</Say>
            <Pause length="1"/>
            <Say voice="alice" language="en-US">This is an automated security alert from Alankara AI.</Say>
        </Response>
        """
        
        call = client.calls.create(
            twiml=twiml,
            to=OWNER_PHONE,
            from_=TWILIO_PHONE_NUMBER
        )
        
        logger.info(f"✅ Twilio call initiated: {call.sid}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Twilio error: {e}")
        return False

@app.route('/send-alert', methods=['POST'])
def send_alert():
    """
    Handle security alert request
    
    Expected JSON:
    {
        "type": "motion" | "face",
        "image": "data:image/jpeg;base64,...",
        "timestamp": "2024-11-20T10:30:00Z",
        "make_call": true | false  # NEW: controls whether to make Twilio call
    }
    
    Returns:
    {
        "success": true,
        "email_sent": true,
        "call_made": true
    }
    """
    try:
        data = request.json
        
        if not data or 'type' not in data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: type, image'
            }), 400
        
        detection_type = data['type']
        image_base64 = data['image']
        timestamp = data.get('timestamp', time.strftime('%Y-%m-%d %H:%M:%S'))
        make_call = data.get('make_call', True)  # Default to True for backward compatibility
        
        logger.info(f"📨 Processing {detection_type} alert at {timestamp} (make_call: {make_call})")
        
        # ALWAYS send email - this happens every time regardless of cooldown
        email_sent = send_email_alert(detection_type, image_base64, timestamp)
        
        # Only make Twilio call if frontend says it's okay (respects cooldown period)
        call_made = False
        if make_call:
            call_made = make_twilio_call(detection_type)
            if call_made:
                logger.info(f"✅ Twilio call made for {detection_type} detection")
            else:
                logger.warning(f"⚠️ Twilio call failed for {detection_type} detection")
        else:
            logger.info(f"📵 Twilio call skipped for {detection_type} detection (cooldown active)")
        
        return jsonify({
            'success': True,
            'email_sent': email_sent,
            'call_made': call_made,
            'timestamp': timestamp
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Alert error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/security-test', methods=['GET'])
def security_test():
    """Test endpoint to verify security configuration"""
    config_status = {
        'owner_email': '✅' if OWNER_EMAIL else '❌ Missing',
        'alert_email': f'✅ {ALERT_EMAIL}' if ALERT_EMAIL else '❌ Missing',
        'owner_phone': '✅' if OWNER_PHONE else '❌ Missing',
        'smtp_configured': '✅' if all([SMTP_USER, SMTP_PASS]) else '❌ Missing',
        'twilio_configured': '✅' if all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER]) else '⚠️ Optional',
        'supabase_configured': '✅' if supabase else '❌ Missing'
    }
    
    all_configured = all(value.startswith('✅') or value.startswith('⚠️') for value in config_status.values())
    
    return jsonify({
        'status': 'ready' if all_configured else 'incomplete',
        'configuration': config_status,
        'message': 'All systems ready for security alerts' if all_configured else 'Please configure missing environment variables'
    }), 200

# ==================== CAMPAIGN EMAIL SYSTEM ====================

@app.route('/send-campaign-emails', methods=['POST'])
def send_campaign_emails():
    """
    Send campaign emails to all registered users who have opted in
    
    Expected JSON:
    {
        "campaign_id": "uuid",
        "title": "Diwali Gold Sale",
        "description": "Get 40% off on all gold jewelry",
        "image_url": "https://...",
        "discount_percentage": 40,
        "end_date": "2026-02-01"
    }
    
    Returns:
    {
        "success": true,
        "emails_sent": 150,
        "emails_failed": 2,
        "total_users": 152
    }
    """
    try:
        if not supabase:
            return jsonify({'success': False, 'error': 'Supabase not configured'}), 500
        
        data = request.json
        campaign_id = data.get('campaign_id')
        title = data.get('title')
        description = data.get('description')
        image_url = data.get('image_url')
        discount = data.get('discount_percentage', 0)
        end_date = data.get('end_date')
        
        logger.info(f"📧 Starting campaign email send: {title}")
        
        # 1. Fetch all registered users from auth.users
        try:
            response = supabase.auth.admin.list_users()
            all_users = response
            logger.info(f"✅ Found {len(all_users)} registered users")
        except Exception as e:
            logger.error(f"❌ Failed to fetch users: {e}")
            return jsonify({'success': False, 'error': f'Failed to fetch users: {str(e)}'}), 500
        
        # 2. Filter users with email addresses
        users_with_email = [u for u in all_users if u.email]
        logger.info(f"📬 {len(users_with_email)} users have email addresses")
        
        # 3. Check email preferences (filter out opted-out users)
        eligible_users = []
        for user in users_with_email:
            try:
                pref_response = supabase.table('user_preferences').select('email_notifications').eq('user_id', user.id).execute()
                
                if not pref_response.data:
                    # No preference set = default opted in
                    eligible_users.append(user)
                elif pref_response.data[0].get('email_notifications', True):
                    # Explicitly opted in
                    eligible_users.append(user)
                else:
                    logger.info(f"⏭️  Skipping {user.email} - opted out")
            except Exception as e:
                # If error checking preferences, assume opted in
                logger.warning(f"⚠️ Could not check preferences for {user.email}, including anyway: {e}")
                eligible_users.append(user)
        
        logger.info(f"✅ {len(eligible_users)} users eligible (opted in)")
        
        # 4. Send emails and log results
        emails_sent = 0
        emails_failed = 0
        
        for user in eligible_users:
            try:
                # Send email
                send_success = send_campaign_email(
                    to_email=user.email,
                    campaign_title=title,
                    campaign_description=description,
                    image_url=image_url,
                    discount_percentage=discount,
                    end_date=end_date
                )
                
                if send_success:
                    emails_sent += 1
                    status = 'sent'
                    error_msg = None
                    logger.info(f"✅ Sent to {user.email}")
                else:
                    emails_failed += 1
                    status = 'failed'
                    error_msg = 'SMTP send failed'
                    logger.error(f"❌ Failed to send to {user.email}")
                
                # Log to campaign_notifications table
                try:
                    supabase.table('campaign_notifications').insert({
                        'campaign_id': campaign_id,
                        'user_id': user.id,
                        'email': user.email,
                        'status': status,
                        'error_message': error_msg
                    }).execute()
                except Exception as log_error:
                    logger.error(f"⚠️ Failed to log notification for {user.email}: {log_error}")
                
            except Exception as e:
                emails_failed += 1
                logger.error(f"❌ Error sending to {user.email}: {e}")
                
                # Log failure
                try:
                    supabase.table('campaign_notifications').insert({
                        'campaign_id': campaign_id,
                        'user_id': user.id,
                        'email': user.email,
                        'status': 'failed',
                        'error_message': str(e)
                    }).execute()
                except:
                    pass
        
        logger.info(f"📊 Campaign complete: {emails_sent} sent, {emails_failed} failed")
        
        return jsonify({
            'success': True,
            'emails_sent': emails_sent,
            'emails_failed': emails_failed,
            'total_users': len(eligible_users)
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Campaign email error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


def send_campaign_email(to_email, campaign_title, campaign_description, image_url, discount_percentage, end_date):
    """
    Send a single campaign email using Gmail SMTP
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        if not all([SMTP_USER, SMTP_PASS, to_email]):
            logger.warning("⚠️ SMTP not configured or no recipient email")
            return False
        
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        msg = MIMEMultipart('related')
        msg['From'] = SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = f"🎁 {campaign_title} - Exclusive Offer Inside!"
        
        # Create HTML email body
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #d4af37 0%, #c4a028 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Alankara AI</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">Exclusive Jewelry Offers</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">{campaign_title}</h2>
                
                {f'<img src="{image_url}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;" alt="Campaign Image" />' if image_url else ''}
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">{campaign_description}</p>
                
                {f'<div style="background: #fef9e7; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0;"><h3 style="color: #d4af37; margin: 0 0 10px 0; font-size: 24px;">Get {discount_percentage}% OFF!</h3><p style="margin: 0; color: #666;">Limited time offer</p></div>' if discount_percentage > 0 else ''}
                
                <p style="color: #999; font-size: 14px; margin-top: 20px;">
                    ⏰ <strong>Offer valid until:</strong> {end_date}
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://alankaraai.com" style="background: #d4af37; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Visit Our Store
                    </a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
                
                <p style="color: #999; font-size: 12px; text-align: center;">
                    You're receiving this email because you're a valued customer of Alankara AI.<br/>
                    <a href="https://alankaraai.com/unsubscribe" style="color: #d4af37;">Unsubscribe from promotional emails</a>
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
        server.quit()
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Email send error to {to_email}: {e}")
        return False

# ==================== SAREE VIRTUAL TRY-ON ====================

_vertex_credentials = None

def get_vertex_access_token():
    """Get Google Cloud access token using Application Default Credentials (no subprocess)."""
    global _vertex_credentials
    try:
        if _vertex_credentials is None:
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

@app.route('/try-on-saree', methods=['POST'])
def try_on_saree():
    """
    Generate a virtual try-on image of a person wearing a saree using Vertex AI.

    Expected JSON:
    {
        "person_image": "data:image/jpeg;base64,...",
        "saree_image": "data:image/jpeg;base64,..."
    }

    Returns:
    {
        "success": true,
        "result_image": "data:image/png;base64,..."
    }
    """
    try:
        data = request.json
        if not data or 'person_image' not in data or 'saree_image' not in data:
            return jsonify({'success': False, 'error': 'Missing person_image or saree_image'}), 400

        # Strip data URL prefix if present
        def extract_base64(data_url):
            return data_url.split(',')[1] if ',' in data_url else data_url

        person_b64 = extract_base64(data['person_image'])
        saree_b64 = extract_base64(data['saree_image'])

        logger.info("🥻 Starting saree try-on via Vertex AI")

        # Get access token
        access_token = get_vertex_access_token()

        # Call Vertex AI virtual try-on model
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
                    "image": {"bytesBase64Encoded": saree_b64}
                }]
            }],
            "parameters": {
                "sampleCount": 1
            }
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
            logger.error(f"Full Vertex AI response: {result}")
            return jsonify({'success': False, 'error': 'No predictions returned from Vertex AI'}), 500

        # GA model returns predictions[0].bytesBase64Encoded or predictions[0].image.bytesBase64Encoded
        pred = predictions[0]
        result_b64 = (
            pred.get('bytesBase64Encoded') or
            pred.get('image', {}).get('bytesBase64Encoded', '')
        )
        mime_type = pred.get('mimeType', 'image/png')

        if not result_b64:
            logger.error(f"Prediction structure: {pred}")
            return jsonify({'success': False, 'error': 'Empty result from Vertex AI'}), 500

        logger.info("✅ Saree try-on generated successfully")

        return jsonify({
            'success': True,
            'result_image': f"data:{mime_type};base64,{result_b64}"
        }), 200

    except RuntimeError as e:
        logger.error(f"❌ Vertex AI auth error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    except requests.exceptions.HTTPError as e:
        logger.error(f"❌ Vertex AI HTTP error: {e.response.text}")
        return jsonify({'success': False, 'error': f"Vertex AI error: {e.response.status_code}"}), 500
    except Exception as e:
        logger.error(f"❌ Saree try-on error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== SERVER STARTUP ====================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"🚀 Starting Alankara AI Backend on port {port}")
    logger.info(f"📧 Email configured: {bool(SMTP_USER and SMTP_PASS)} -> {ALERT_EMAIL}")
    logger.info(f"📞 Twilio configured: {bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN)}")
    logger.info(f"💾 Supabase configured: {bool(supabase)}")
    app.run(host='0.0.0.0', port=port, debug=False)