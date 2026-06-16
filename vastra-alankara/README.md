# Vastra Alankara AI — Virtual Clothing Try-On

AI-powered virtual try-on for sarees, dresses, and ethnic wear using Google Vertex AI.

---

## Project Structure

```
vastra-alankara/
├── backend/                  # Python Flask API
│   ├── app.py                # Single endpoint: POST /try-on
│   ├── requirements.txt
│   └── .env.example
└── frontend/                 # React + Vite UI
    ├── src/
    │   ├── App.tsx           # Main app
    │   ├── components/
    │   │   ├── GarmentSelector.tsx   # Garment picker grid
    │   │   └── TryOnCamera.tsx       # Webcam capture + result display
    │   └── data/
    │       └── catalog.ts    # Garment catalog — edit this to add items
    └── public/
        └── garments/         # Put garment images here
```

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.10+ | https://python.org |
| Google Cloud SDK | Latest | https://cloud.google.com/sdk/docs/install |

---

## One-Time Setup

### 1. Google Cloud Authentication

You will be given a `vastra-key.json` service account file by the project lead.

**Option A — Service account file (recommended):**
```bash
# Set this env var in backend/.env
GOOGLE_APPLICATION_CREDENTIALS_JSON=<paste full contents of vastra-key.json here>
```

**Option B — Your own Google account (dev only):**
```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Backend Setup

```bash
cd backend

# Copy and fill in the env file
copy .env.example .env
# Edit .env and add VERTEX_PROJECT_ID

# Install dependencies
pip install -r requirements.txt
```

`.env` file contents:
```env
VERTEX_PROJECT_ID=your-gcp-project-id
VERTEX_REGION=us-central1
PORT=5000
```

### 3. Frontend Setup

```bash
cd frontend

# Copy and fill in the env file
copy .env.example .env

# Install dependencies
npm install
```

`.env` file contents:
```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## Running the Project

You need **two terminals** open at the same time.

### Terminal 1 — Start Backend
```bash
cd backend
python app.py
```
You should see: `Running on http://0.0.0.0:5000`

### Terminal 2 — Start Frontend
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5174/`

Open browser and go to: `http://localhost:5174`

---

## Adding Garments

### Step 1 — Add the image
Copy your garment image to:
```
frontend/public/garments/saree3.jpg
```
Supported formats: `.jpg`, `.png`, `.webp`, `.avif`

**Best image type:** Studio photo of model wearing the garment, clean background, no accessories at neck.

### Step 2 — Add to catalog
Open `frontend/src/data/catalog.ts` and add an entry:

```typescript
{
  id: 'saree-3',
  name: 'Kanjivaram Saree',
  color: 'Green & Gold',
  category: 'saree',
  imageUrl: '/garments/saree3.jpg',
}
```

Categories available: `'saree' | 'dress' | 'lehenga' | 'kurti'`

---

## How the Try-On API Works

**Endpoint:** `POST /try-on`

**Request:**
```json
{
  "person_image": "data:image/jpeg;base64,...",
  "garment_image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "result_image": "data:image/png;base64,..."
}
```

The backend sends both images to Google Vertex AI `virtual-try-on-001` model which generates a realistic try-on result.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `No module named 'flask'` | Run `pip install -r requirements.txt` |
| `npm run dev` fails | Run `npm install` first |
| Try-on returns 500 error | Check `VERTEX_PROJECT_ID` in backend `.env` |
| Auth error on first try-on | Run `gcloud auth application-default login` |
| Camera not working | Allow camera permission in browser settings |
| Garment image not showing | Check image is in `frontend/public/garments/` and path in `catalog.ts` is correct |
