# Lavix

AI-powered virtual trial room for retail. Customers try on garments on a touchscreen
kiosk using a live webcam and Google Vertex AI (`virtual-try-on-001`); store staff
manage the catalogue, security alerts, and feedback analytics from an admin panel
built into the same app.

Live at **[www.lavix.in](https://www.lavix.in)** — marketing site at the root,
kiosk at `/tryon`.

## Architecture

Four pieces, three of them in this repo:

```
www.lavix.in            → marketing site   (separate repo, see below)
www.lavix.in/tryon      → kiosk            (frontend/customer)
www.lavix.in/tryon/admin→ admin panel      (same app, route inside frontend/customer)
www.lavix.in/api/*      → backend          (backend)
```

| Path | What it is | Stack |
|---|---|---|
| `backend/` | Flask API: try-on (Vertex AI + a local fallback compositor), garment catalogue (Supabase), Book Demo email, security alerts (email + Twilio) | Flask, gunicorn, Pillow, rembg |
| `frontend/customer/` | The kiosk SPA — customer-facing try-on flow **and** the admin panel (`/admin` route) | React 18, Vite, React Router, MediaPipe |
| `scripts/smoke-test.sh` | Post-deploy check against the live stack | bash + curl |
| `frontend/admin/` | An earlier standalone admin panel export. **Not deployed** — not referenced by `docker-compose.yml` or built anywhere. The live admin panel is inside `frontend/customer`. Left here for reference; don't build features against it. | — |

The **marketing site** (`www.lavix.in` root) is a **separate repository**
(`lavix-website`), cloned as a sibling of this one on the deploy VM. It is not
part of this repo and `git pull` here does not update it.

## Local development

**Backend**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # then fill in the values you need — see below
python app.py          # http://localhost:5000
```

**Kiosk / admin frontend**
```bash
cd frontend/customer
npm install
npm run dev             # http://localhost:5173/tryon/
```

The dev server serves under `/tryon/` (matches production routing) but runs
standalone — it does **not** proxy to a local backend by default. Without the
backend running, garment lists are empty and try-on requests fail; that's
expected. To exercise a page that doesn't need the catalogue, go straight to
`http://localhost:5173/tryon/mens/1` (renders from static demo data).

Point the frontend at a local backend with `VITE_BACKEND_URL` (see
`frontend/customer/src/app/services/api.ts`); it defaults to
`http://localhost:5000`.

## Environment variables

Read from `backend/.env`. None of these are required to boot the server —
each feature degrades independently if its variables are missing (try-on falls
back to a local compositor without Vertex creds, alerts just don't send without
SMTP config, and so on). `backend/.env.example` has a starting point.

| Variable | Used for |
|---|---|
| `PORT`, `ALLOWED_ORIGINS` | Server basics / CORS |
| `SUPABASE_URL`, `SUPABASE_KEY` | Garment catalogue storage. Falls back to a local JSON file if unset |
| `VERTEX_PROJECT_ID`, `VERTEX_REGION`, `VERTEX_TIMEOUT` | Vertex AI try-on |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | Vertex AI service account (or mount ADC — see `docker-compose.yml`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Outgoing mail (Book Demo form + security alerts) |
| `TO_EMAIL` / `BOOK_DEMO_EMAIL`, `ALERT_EMAIL`, `OWNER_EMAIL`, `OWNER_PHONE` | Mail/alert recipients; `OWNER_EMAIL`/`OWNER_PHONE` also work as admin-login usernames against the default password |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | Optional: phone call on a security alert |

Hit `/security-test` on a running backend to check which of these are
actually configured.

## Testing

```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest                    # unit tests: image pipeline, /try-on contract

./scripts/smoke-test.sh             # run after every deploy, against the live stack
```

Why both: nearly every bug this project has shipped was a **configuration**
bug — a timeout equal to the layer above it, a redirect built from a proxied
`Host` header, two services claiming the same port — not a logic bug. Unit
tests can't see that class of failure; the smoke test asserts against the
running system specifically because of it.

## Deployment

See **[DEPLOY.md](DEPLOY.md)** — VM layout, the shared reverse-proxy
constraint (this VM also hosts an unrelated project; **never publish 80/443**
from this repo's frontend), the marketing repo's Git LFS requirement, and the
nginx routing table.
