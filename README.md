# Alankara AI — Virtual Jewelry & Saree Try-On Kiosk

AI-powered kiosk that lets customers virtually try on jewelry (live via webcam) and sarees (via Vertex AI generation).

---

## Prerequisites

Install these before anything else:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.10+ | https://python.org |
| Google Cloud SDK | Latest | https://cloud.google.com/sdk/docs/install |

---

## One-Time Setup

### 1. Clone / Extract the project

```
alankaraAI-project/
  backend/
  frontend/
```

### 2. Set up backend environment file

Create `backend/.env` and fill in these values:

```env
# Owner Contact
OWNER_EMAIL=your@email.com
OWNER_PHONE=+91XXXXXXXXXX

# Gmail SMTP (for alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# Twilio (for voice alerts)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

# Port
PORT=5000

# Supabase
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
VITE_KIOSK_ID=KIOSK_001

# Vertex AI (for saree try-on)
VERTEX_PROJECT_ID=your-gcp-project-id
VERTEX_REGION=us-central1
```

### 3. Set up frontend environment file

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
VITE_KIOSK_ID=KIOSK_001
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Authenticate Google Cloud (for Vertex AI saree try-on)

Run this once in terminal — it opens a browser to log in:

```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### 5. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 6. Install frontend dependencies

```bash
cd frontend
npm install
```

---

## Running the Kiosk

You need **two terminals** open at the same time.

### Terminal 1 — Start Backend

```bash
cd backend
python app.py
```

You should see:
```
* Running on http://0.0.0.0:5000
```

### Terminal 2 — Start Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in xxx ms
Local: http://localhost:5173/
```

### Open the kiosk

Open browser and go to:
```
http://localhost:5173
```

---

## Kiosk Mode (Full Screen — for actual kiosk deployment)

To run in fullscreen kiosk mode without browser UI:

**Chrome / Edge:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:5173
```

Or Edge:
```bash
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk http://localhost:5173 --edge-kiosk-type=fullscreen
```

**To exit kiosk mode:** Press `Alt + F4`

---

## Login Credentials

```
Email:    Alankaraai@gmail.com
Password: Admin@1225
```

---

## Features

| Feature | How it works |
|---------|-------------|
| Live jewelry try-on | MediaPipe face/pose detection overlays jewelry on webcam in real time |
| Saree try-on | Customer snaps photo → Vertex AI generates saree result → jewelry overlaid on top |
| Emotion analytics | DeepFace detects customer emotion while trying on jewelry |
| Admin dashboard | View analytics, try-on events, visitor data via Supabase |
| Customer support chat | Built-in support modal |

---

## Saree Catalog

Saree images are in `frontend/public/sarees/`. To add more sarees:

1. Copy the image to `frontend/public/sarees/sareeN.jpg` (jpg/png/webp/avif all work)
2. Add an entry in `frontend/src/data/sarees.ts`:

```typescript
{
  id: 'saree-6',
  name: 'Your Saree Name',
  color: 'Color & Gold',
  imageUrl: '/sarees/saree6.jpg',
}
```

**Best saree image type:** Studio photo of model wearing saree, no necklace, clean background.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Backend won't start | Check Python version (`python --version`) and that all packages installed |
| Camera not working | Allow camera permission in browser, check no other app is using it |
| Saree try-on fails (500 error) | Run `gcloud auth application-default login` again |
| Jewelry not fitting | Stand still for 2-3 seconds before clicking "Generate Look" so landmarks are captured |
| Port already in use | Kill existing process: `netstat -ano \| findstr :5000` then `taskkill /PID <id> /F` |

---

## Project Structure

```
alankaraAI-project/
├── backend/
│   ├── app.py              # Flask server (emotion detection, Vertex AI, alerts)
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Secret keys (not committed to git)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VirtualTryOn.tsx     # Main try-on camera + jewelry overlay
│   │   │   └── SareeSelector.tsx    # Saree selection UI
│   │   ├── data/
│   │   │   └── sarees.ts            # Saree catalog
│   │   ├── detectors/
│   │   │   └── DetectorManager.ts   # MediaPipe model loader
│   │   └── utils/
│   │       └── jewelry-positioner.ts # Jewelry placement logic
│   ├── public/sarees/      # Saree product images
│   └── .env                # Frontend env (not committed to git)
└── README.md
```
