# Lavix — GCP VM Deployment

Everything runs on one VM behind one nginx. No Netlify, no extra GCP services.

```
www.lavix.in            → marketing container (static React site)
www.lavix.in/tryon      → kiosk container (static React SPA)
www.lavix.in/api/*      → Flask backend (try-on, book-demo, security alerts)
```

| Container | Repo | Serves |
|---|---|---|
| `lavix-frontend-1` | this repo | nginx: SSL, routing, kiosk SPA |
| `lavix-marketing-1` | `lavix-website` | marketing site |
| `lavix-backend-1` | this repo | Flask API |

---

## First-time setup on the VM

The marketing site lives in a **separate repo** that must sit next to this one:

```
/mnt/data/lavix/
├── Lavix/            ← this repo (docker-compose.yml lives here)
└── lavix-website/    ← marketing repo, cloned as a sibling
```

### 1. Install Git LFS — do this BEFORE cloning

The marketing repo stores `intro.mp4` (~144MB) and `demo.mp4` (~25MB) in Git LFS.
**Without git-lfs installed, `git clone` silently succeeds but writes 130-byte
pointer text files instead of the videos.** The build works, the site deploys,
and both videos are simply broken with no error anywhere. Install it first:

```bash
sudo apt-get update && sudo apt-get install -y git-lfs
git lfs install
```

### 2. Clone the marketing repo as a sibling

```bash
cd /mnt/data/lavix
git clone https://github.com/yaswanthbyrapuneni-cpu/lavix-website.git
```

### 3. Verify the videos are real files, not LFS pointers

```bash
ls -lh /mnt/data/lavix/lavix-website/public/*.mp4
```

Expect ~144M and ~25M. If they show as ~130 bytes, LFS did not run:

```bash
cd /mnt/data/lavix/lavix-website && git lfs pull
```

### 4. Build and start

```bash
cd /mnt/data/lavix/Lavix
docker compose up -d --build
```

---

## Routine redeploys

**Kiosk or backend** (this repo):
```bash
cd /mnt/data/lavix/Lavix
git pull origin main
docker compose up -d --build            # add `backend` or `frontend` to narrow
```

**Marketing site** (separate repo — `git pull` in Lavix/ does NOT update it):
```bash
cd /mnt/data/lavix/lavix-website && git pull origin main
cd /mnt/data/lavix/Lavix && docker compose up -d --build marketing
```

---

## Environment

`backend/.env` supplies SMTP for both the security alerts and the Book Demo
form. The form accepts `SMTP_PASS` (used by the alerts) or `SMTP_PASSWORD`
(the old Netlify variable name). Destination defaults to
`future@aismartlive.com`, overridable with `BOOK_DEMO_EMAIL`.

## Health checks

```bash
curl -sk https://www.lavix.in/health                    # Flask alive
curl -sk https://www.lavix.in/security-test             # SMTP + Twilio config
curl -skI https://www.lavix.in/ | head -1               # marketing site
curl -skI https://www.lavix.in/tryon/ | head -1         # kiosk
curl -skI https://www.lavix.in/intro.mp4 | head -3      # video + Accept-Ranges
```

The last one should report `HTTP/1.1 200` and `Accept-Ranges: bytes`. If it
returns a few hundred bytes instead of ~144MB, you are serving an LFS pointer —
go back to step 1.

## Routing gotcha

nginx sends only paths matching
`^/(api|garments|try-on|health|tryon-status|send-alert|security-test)`
to Flask. Everything else goes to the marketing container. A new Flask endpoint
that is not added to that regex will appear to work locally and 404 in
production.
