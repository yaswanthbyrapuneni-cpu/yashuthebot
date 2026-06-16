# Vastra Alankara AI

Virtual clothing try-on for sarees and ethnic wear using Google Vertex AI.

---

## What This Project Does

- Opens the webcam
- User selects a saree from the catalog
- Clicks "Generate Try-On"
- AI generates an image of the person wearing that saree

---

## What You Need Before Starting

Install these on your machine:

1. **Node.js 18+** → https://nodejs.org (click LTS version)
2. **Python 3.10+** → https://python.org
3. **Google Cloud SDK** → https://cloud.google.com/sdk/docs/install

---

## Project Folder Structure

```
vastra-alankara/
├── backend/          → Python Flask server (talks to Vertex AI)
├── frontend/         → React web app (camera + UI)
└── README.md
```

---

## Step 1 — Set Up Backend

Open a terminal and go to the backend folder:

```bash
cd vastra-alankara/backend
```

Copy `.env.example` and rename it to `.env`:

```bash
copy .env.example .env
```

The `.env` file already has the correct values — no changes needed.

> **Note:** Your Gmail account must be added to the GCP project by the project lead before you can use Vertex AI. Ask them to run:
> ```
> gcloud projects add-iam-policy-binding project-bc9ba853-ede2-43c2-a3e --member="user:your@gmail.com" --role="roles/aiplatform.user"
> ```
> Then run `gcloud auth application-default login` on your machine once.

Install Python packages:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
python app.py
```

You should see:
```
Running on http://0.0.0.0:5000
```

Leave this terminal open.

---

## Step 2 — Set Up Frontend

Open a **second terminal** and go to the frontend folder:

```bash
cd vastra-alankara/frontend
```

Create a file called `.env` in that folder with this content:

```
VITE_BACKEND_URL=http://localhost:5000
```

Install packages:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

You should see:
```
Local: http://localhost:5174/
```

Leave this terminal open too.

---

## Step 3 — Open the App

Open your browser and go to:

```
http://localhost:5174
```

---

## How to Use

1. Select a saree from the top
2. Click **Start Camera** and allow camera access
3. Stand 4–5 feet back so your full body is visible
4. Click **Generate Try-On**
5. Wait 10–15 seconds for the AI result
6. Click **Try Again** to try a different saree

---

## Adding New Sarees or Dresses

**Step 1** — Copy the garment image into:
```
frontend/public/garments/
```
Example: `saree6.jpg`

**Step 2** — Open `frontend/src/data/catalog.ts` and add an entry:

```typescript
{
  id: 'saree-6',
  name: 'Your Saree Name',
  color: 'Color Description',
  category: 'saree',
  imageUrl: '/garments/saree6.jpg',
}
```

Supported image formats: `.jpg` `.png` `.webp` `.jpeg`

**Best image type:** Studio photo of a model wearing the garment with a clean background and no heavy necklace at neck area.

---

## API Reference

The backend has one main endpoint:

**POST** `/try-on`

Send:
```json
{
  "person_image": "data:image/jpeg;base64,...",
  "garment_image": "data:image/jpeg;base64,..."
}
```

Receive:
```json
{
  "success": true,
  "result_image": "data:image/png;base64,..."
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` in backend folder |
| `npm run dev` fails | Run `npm install` in frontend folder first |
| Camera not showing | Allow camera permission in browser, check no other app is using it |
| Try-on returns error 403 | `GOOGLE_APPLICATION_CREDENTIALS_JSON` is wrong or missing in backend `.env` |
| Try-on returns error 400 | Bad image format — make sure garment images are `.jpg` or `.png` |
| Result looks like a catalog photo | Stand further back so full body is visible, improve lighting |
| Backend not connecting | Make sure backend is running on port 5000 before opening the browser |
