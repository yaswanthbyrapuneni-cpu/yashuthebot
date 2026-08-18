"""
Image helpers: convert_to_clean_rgb_b64 and process_local_tryon.

These run on every try-on request, on customer-supplied images, so they are the
most likely place for a malformed input to take the kiosk down.
"""
import base64
import io

import pytest
from PIL import Image

from conftest import data_url


def decode(b64):
    return Image.open(io.BytesIO(base64.b64decode(b64)))


# ── convert_to_clean_rgb_b64 ────────────────────────────────────────────────

def test_converts_rgb_png_to_jpeg(backend, person_b64):
    out = backend.convert_to_clean_rgb_b64(person_b64)
    assert decode(out).format == "JPEG"


def test_flattens_transparency_onto_white(backend, png_factory):
    """RGBA must be flattened; Vertex rejects alpha channels."""
    rgba = png_factory(100, 100, (255, 0, 0, 0), mode="RGBA")
    img = decode(backend.convert_to_clean_rgb_b64(rgba))
    assert img.mode == "RGB"
    # Fully transparent pixels should land on white, not black.
    assert img.getpixel((50, 50)) == (255, 255, 255)


def test_garbage_base64_does_not_raise(backend):
    """Never crash the worker on a bad frame -- degrade instead."""
    assert backend.convert_to_clean_rgb_b64("!!!not-base64!!!") is not None


def test_empty_string_does_not_raise(backend):
    assert backend.convert_to_clean_rgb_b64("") is not None


# ── process_local_tryon ─────────────────────────────────────────────────────

def test_local_tryon_composites_garment(backend, person_b64, garment_b64):
    out = backend.process_local_tryon(person_b64, [garment_b64])
    assert out != person_b64, "compositor returned the input unchanged"
    decode(out).verify()


def test_local_tryon_accepts_data_url_prefix(backend, person_b64, garment_b64):
    """The frontend sends data: URLs; the helper strips them itself."""
    out = backend.process_local_tryon(data_url(person_b64), [data_url(garment_b64)])
    decode(out).verify()


def test_local_tryon_with_no_garments_returns_valid_image(backend, person_b64):
    out = backend.process_local_tryon(person_b64, [])
    decode(out).verify()


def test_local_tryon_skips_corrupt_garment(backend, person_b64, garment_b64):
    """One bad garment must not lose the whole render."""
    out = backend.process_local_tryon(person_b64, ["@@@corrupt@@@", garment_b64])
    decode(out).verify()


def test_local_tryon_handles_tiny_image(backend, png_factory):
    """Guards the h > 100 crop branch and the max(20, ...) clamps."""
    tiny = png_factory(30, 30)
    out = backend.process_local_tryon(tiny, [tiny])
    decode(out).verify()


def test_local_tryon_output_is_not_multi_megabyte(backend, person_b64, garment_b64):
    """
    Saved as PNG a 1080x1920 photo balloons to several MB, then ~33% more as
    base64 -- straight into the response body on a kiosk connection measured at
    ~5 Mbps. Photographic output should be JPEG.
    """
    out = backend.process_local_tryon(person_b64, [garment_b64])
    size_mb = len(out) * 3 / 4 / 1024 / 1024
    assert size_mb < 2.0, f"local composite is {size_mb:.1f}MB -- too large to return"


def test_local_tryon_signals_failure_instead_of_echoing_input(backend, garment_b64):
    """
    On an undecodable person image the compositor used to return that same
    string, which the endpoint then wrapped and reported as success:true. The
    customer got their own photo back with no garment and no error.
    """
    with pytest.raises(Exception):
        backend.process_local_tryon("###not-an-image###", [garment_b64])
