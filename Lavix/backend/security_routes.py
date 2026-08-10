"""
Security Alert Routes — drop these into your Flask app.py

Required .env variables:
  OWNER_EMAIL=you@gmail.com
  OWNER_PHONE=+91XXXXXXXXXX       # phone to call via Twilio
  ALERT_EMAIL=alerts@gmail.com    # email to receive alerts
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your@gmail.com
  SMTP_PASS=your_app_password
  TWILIO_ACCOUNT_SID=ACxxx
  TWILIO_AUTH_TOKEN=xxx
  TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

Usage in app.py:
  from security_routes import register_security_routes
  register_security_routes(app)
"""

import os
import base64
import smtplib
import time
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from flask import request, jsonify

logger = logging.getLogger(__name__)

def get_security_config():
    from dotenv import load_dotenv
    from pathlib import Path
    # Force reload environment variables from .env file
    load_dotenv(dotenv_path=Path(__file__).parent / ".env", override=True)
    return {
        'SMTP_HOST': os.getenv('SMTP_HOST', 'smtp.gmail.com'),
        'SMTP_PORT': int(os.getenv('SMTP_PORT', 587)),
        'SMTP_USER': os.getenv('SMTP_USER'),
        'SMTP_PASS': os.getenv('SMTP_PASS'),
        'ALERT_EMAIL': os.getenv('ALERT_EMAIL'),
        'OWNER_PHONE': os.getenv('OWNER_PHONE'),
        'TWILIO_ACCOUNT_SID': os.getenv('TWILIO_ACCOUNT_SID'),
        'TWILIO_AUTH_TOKEN': os.getenv('TWILIO_AUTH_TOKEN'),
        'TWILIO_PHONE_NUMBER': os.getenv('TWILIO_PHONE_NUMBER'),
    }


def send_email_alert(detection_type: str, image_base64: str, timestamp: str) -> bool:
    try:
        cfg = get_security_config()
        smtp_user = cfg['SMTP_USER']
        smtp_pass = cfg['SMTP_PASS']
        alert_email = cfg['ALERT_EMAIL']
        smtp_host = cfg['SMTP_HOST']
        smtp_port = cfg['SMTP_PORT']

        if not all([smtp_user, smtp_pass, alert_email]):
            logger.error("Email config missing")
            return False

        msg = MIMEMultipart('related')
        msg['From'] = smtp_user
        msg['To'] = alert_email
        msg['Subject'] = f"🚨 Security Alert - {detection_type.capitalize()} Detected"

        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 20px; max-width: 600px;">
          <h2 style="color: #d32f2f; font-size: 24px; margin-bottom: 20px; font-weight: bold; display: flex; items-center: center; gap: 8px;">
            🚨 Security Alert
          </h2>
          <div style="font-size: 14px; margin-bottom: 20px;">
            <p style="margin: 6px 0;"><strong>Alert Type:</strong> {detection_type.upper()} DETECTED</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> {timestamp}</p>
            <p style="margin: 6px 0;"><strong>Location:</strong> Alankara AI Kiosk</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 14px; margin-bottom: 10px;">
            {"ℹ️ Face has been detected at your kiosk location." if detection_type == "face" else "ℹ️ Motion has been detected at your kiosk location."}
          </p>
          <p style="font-size: 14px; margin-bottom: 20px;">
            Please check the attached image and take appropriate action if necessary.
          </p>
          <p style="color: #888; font-size: 11px; margin-bottom: 25px;">
            This is an automated alert from your Alankara AI Security System.
          </p>
          <div style="margin-top: 15px;">
            <img src="cid:security_image" alt="Security Snapshot" style="max-width: 400px; width: 100%; border-radius: 4px; border: 1px solid #eaeaea; display: block;" />
          </div>
        </body>
        </html>
        """
        
        msg_alternative = MIMEMultipart('alternative')
        msg.attach(msg_alternative)
        msg_alternative.attach(MIMEText(body, 'html'))

        try:
            img_data = image_base64.split(',')[1] if ',' in image_base64 else image_base64
            img_bytes = base64.b64decode(img_data)
            
            image = MIMEImage(img_bytes)
            image.add_header('Content-ID', '<security_image>')
            image.add_header('Content-Disposition', 'inline', filename=f"security_{detection_type}.jpg")
            msg.attach(image)
        except Exception as e:
            logger.warning(f"Could not attach inline image: {e}")

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        logger.info(f"✅ Alert email sent to {alert_email}")
        return True

    except Exception as e:
        logger.error(f"❌ Email error: {e}")
        return False


def make_twilio_call(detection_type: str) -> bool:
    try:
        cfg = get_security_config()
        acc_sid = cfg['TWILIO_ACCOUNT_SID']
        auth_token = cfg['TWILIO_AUTH_TOKEN']
        phone_num = cfg['TWILIO_PHONE_NUMBER']
        owner_phone = cfg['OWNER_PHONE']

        if not all([acc_sid, auth_token, phone_num, owner_phone]):
            logger.warning("Twilio config missing — skipping call")
            return False

        from twilio.rest import Client
        client = Client(acc_sid, auth_token)

        message = (
            "Alert! Someone is detected at your Vastra Alankara kiosk. Please check immediately."
            if detection_type == 'face'
            else "Security alert. Motion detected at your Vastra Alankara kiosk."
        )

        twiml = f"""
        <Response>
          <Say voice="alice" language="en-US">{message}</Say>
          <Pause length="1"/>
          <Say voice="alice" language="en-US">This is an automated alert from your kiosk security system.</Say>
        </Response>
        """

        call = client.calls.create(twiml=twiml, to=owner_phone, from_=phone_num)
        logger.info(f"✅ Twilio call made: {call.sid}")
        return True

    except Exception as e:
        logger.error(f"❌ Twilio error: {e}")
        return False


import json
from pathlib import Path

SETTINGS_FILE = Path(__file__).parent / "security_settings.json"

def load_security_settings(kiosk_id="VASTRA_KIOSK_001"):
    if not SETTINGS_FILE.exists():
        return {
            "kiosk_id": kiosk_id,
            "security_mode_enabled": False,
            "auto_mode_enabled": True,
            "manual_override": False,
            "start_time": "22:00:00",
            "end_time": "07:00:00",
            "siren_active": False
        }
    try:
        with open(SETTINGS_FILE, "r") as f:
            data = json.load(f)
            return data.get(kiosk_id, {
                "kiosk_id": kiosk_id,
                "security_mode_enabled": False,
                "auto_mode_enabled": True,
                "manual_override": False,
                "start_time": "22:00:00",
                "end_time": "07:00:00",
                "siren_active": False
            })
    except Exception:
        return {
            "kiosk_id": kiosk_id,
            "security_mode_enabled": False,
            "auto_mode_enabled": True,
            "manual_override": False,
            "start_time": "22:00:00",
            "end_time": "07:00:00",
            "siren_active": False
        }

def save_security_settings(kiosk_id, settings):
    try:
        all_settings = {}
        if SETTINGS_FILE.exists():
            with open(SETTINGS_FILE, "r") as f:
                all_settings = json.load(f)
        all_settings[kiosk_id] = settings
        with open(SETTINGS_FILE, "w") as f:
            json.dump(all_settings, f, indent=2)
        return True
    except Exception:
        return False

def register_security_routes(app):
    """Call this in app.py: register_security_routes(app)"""

    @app.route('/send-alert', methods=['POST'])
    def send_alert():
        try:
            data = request.json
            if not data or 'type' not in data or 'image' not in data:
                return jsonify({'success': False, 'error': 'Missing fields: type, image'}), 400

            detection_type = data['type']
            image_base64 = data['image']
            timestamp = data.get('timestamp', time.strftime('%Y-%m-%d %H:%M:%S'))
            make_call = data.get('make_call', True)

            email_sent = send_email_alert(detection_type, image_base64, timestamp)
            call_made = make_twilio_call(detection_type) if make_call else False

            return jsonify({
                'success': True,
                'email_sent': email_sent,
                'call_made': call_made,
                'timestamp': timestamp,
            }), 200

        except Exception as e:
            logger.error(f"Alert error: {e}")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/security/settings', methods=['GET'])
    def get_security_settings_route():
        kiosk_id = request.args.get('kiosk_id', 'VASTRA_KIOSK_001')
        settings = load_security_settings(kiosk_id)
        return jsonify(settings), 200

    @app.route('/api/security/settings', methods=['POST'])
    def save_security_settings_route():
        try:
            data = request.json or {}
            kiosk_id = data.get('kiosk_id', 'VASTRA_KIOSK_001')
            
            # Load current settings first to preserve fields
            current = load_security_settings(kiosk_id)
            for k, v in data.items():
                current[k] = v
                
            success = save_security_settings(kiosk_id, current)
            return jsonify({'success': success, 'settings': current}), 200 if success else 500
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/security-test', methods=['GET'])
    def security_test():
        """Hit this URL in a browser to verify all config is correct."""
        cfg = get_security_config()
        smtp_user = cfg['SMTP_USER']
        smtp_pass = cfg['SMTP_PASS']
        alert_email = cfg['ALERT_EMAIL']
        acc_sid = cfg['TWILIO_ACCOUNT_SID']
        auth_token = cfg['TWILIO_AUTH_TOKEN']
        phone_num = cfg['TWILIO_PHONE_NUMBER']
        owner_phone = cfg['OWNER_PHONE']

        all_ok = all([smtp_user, smtp_pass, alert_email, acc_sid, auth_token, phone_num, owner_phone])
        return jsonify({
            'smtp_configured': '✅' if all([smtp_user, smtp_pass]) else '❌ Missing',
            'twilio_configured': '✅' if all([acc_sid, auth_token, phone_num]) else '❌ Missing',
            'alert_email': alert_email or '❌ Not set',
            'owner_phone': owner_phone or '❌ Not set',
            'message': 'All systems ready' if all_ok else 'Fix missing environment variables',
        }), 200
