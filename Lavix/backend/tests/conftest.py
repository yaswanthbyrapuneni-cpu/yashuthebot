"""
Shared fixtures. Keeps the app importable without Supabase or Vertex creds so
the suite runs anywhere, including CI.
"""
import base64
import io
import os
import sys

import pytest
from PIL import Image

# Import app.py from the parent directory without needing it installed.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Must be set before importing app: it reads these at module scope and would
# otherwise try to reach the real Supabase project during collection.
os.environ.setdefault("SUPABASE_URL", "")
os.environ.setdefault("SUPABASE_KEY", "")


@pytest.fixture(scope="session")
def flask_app():
    import app as app_module
    app_module.app.config.update(TESTING=True)
    return app_module.app


@pytest.fixture(scope="session")
def backend():
    """The app module itself, for testing helper functions directly."""
    import app as app_module
    return app_module


@pytest.fixture()
def client(flask_app):
    return flask_app.test_client()


def _png_b64(width=400, height=800, colour=(120, 90, 200), mode="RGB", textured=False):
    """
    A real, decodable image as raw base64 (no data: prefix).

    textured=True draws a subject on a light ground. Flat colour fills are a
    poor stand-in for photographs here: rembg finds no salient subject in one
    and strips the whole image, so a compositing test against a solid fill
    silently passes through unchanged.
    """
    img = Image.new(mode, (width, height), colour)
    if textured:
        from PIL import ImageDraw
        img = Image.new(mode, (width, height), (245, 245, 245)[: len(colour)])
        d = ImageDraw.Draw(img)
        d.rectangle([width * 0.25, height * 0.15, width * 0.75, height * 0.85], fill=colour)
        d.ellipse([width * 0.35, height * 0.05, width * 0.65, height * 0.3], fill=(90, 60, 40))
        for i in range(0, int(height * 0.7), 40):
            d.line([width * 0.25, height * 0.15 + i, width * 0.75, height * 0.15 + i],
                   fill=(255, 255, 255), width=6)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


@pytest.fixture()
def person_b64():
    # Portrait, kiosk-ish proportions, with a subject rembg can find.
    return _png_b64(600, 1000, (200, 180, 160), textured=True)


@pytest.fixture()
def garment_b64():
    return _png_b64(400, 600, (180, 40, 60), textured=True)


@pytest.fixture()
def png_factory():
    return _png_b64


def data_url(raw_b64, mime="image/png"):
    """Wrap raw base64 the way a browser canvas/webcam would."""
    return f"data:{mime};base64,{raw_b64}"
