"""
Migrates garment images from local storage to Supabase Storage
and updates the database URLs.
"""
import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
LOCAL_UPLOADS = Path(__file__).parent / "static" / "uploads"
BUCKET = "garments"

headers = {
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "apikey": SUPABASE_KEY,
}

def get_all_garments():
    url = f"{SUPABASE_URL}/rest/v1/garments?select=id,name,image_url&image_url=like.http://localhost:5000*"
    res = requests.get(url, headers=headers)
    return res.json()

def upload_to_supabase(filename, file_bytes, mime_type):
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{filename}"
    res = requests.post(url, headers={
        **headers,
        "Content-Type": mime_type,
        "x-upsert": "true"
    }, data=file_bytes)
    return res.status_code in (200, 201)

def update_db_url(garment_id, new_url):
    url = f"{SUPABASE_URL}/rest/v1/garments?id=eq.{garment_id}"
    res = requests.patch(url, headers={**headers, "Content-Type": "application/json"},
                         json={"image_url": new_url})
    return res.status_code in (200, 204)

def get_mime(filename):
    ext = filename.split(".")[-1].lower()
    return {"jpg": "image/jpeg", "jpeg": "image/jpeg",
            "png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")

garments = get_all_garments()
print(f"Found {len(garments)} garments with localhost URLs\n")

migrated = 0
skipped = 0

for g in garments:
    old_url = g["image_url"]
    filename = old_url.split("/")[-1]
    local_path = LOCAL_UPLOADS / filename

    if not local_path.exists():
        print(f"  SKIP (file not found locally): {filename}")
        skipped += 1
        continue

    file_bytes = local_path.read_bytes()
    mime = get_mime(filename)

    if upload_to_supabase(filename, file_bytes, mime):
        new_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{filename}"
        if update_db_url(g["id"], new_url):
            print(f"  ✓ Migrated: {g['name']} → {filename}")
            migrated += 1
        else:
            print(f"  ✗ DB update failed: {g['name']}")
    else:
        print(f"  ✗ Upload failed: {filename}")

print(f"\nDone. Migrated: {migrated} | Skipped (missing locally): {skipped}")
print(f"\nFor the {skipped} skipped garments, ask your colleague to:")
print(f"  1. Upload their files from backend/static/uploads/ to Supabase Storage → '{BUCKET}' bucket")
print(f"  2. Then run the SQL in the README to update remaining URLs")
