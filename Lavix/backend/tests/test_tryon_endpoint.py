"""
/try-on contract tests.

No Vertex credentials in the test environment, so every request here exercises
the fallback path -- which is exactly the path that misbehaved in production.
"""
import json

from conftest import data_url


def post_tryon(client, payload):
    return client.post("/try-on", data=json.dumps(payload),
                       content_type="application/json")


# ── input validation ────────────────────────────────────────────────────────

def test_missing_person_image_is_rejected(client, garment_b64):
    r = post_tryon(client, {"garment_image": garment_b64})
    assert r.status_code == 400
    assert r.get_json()["success"] is False


def test_missing_garment_is_rejected(client, person_b64):
    r = post_tryon(client, {"person_image": person_b64})
    assert r.status_code == 400


def test_empty_garment_list_is_rejected(client, person_b64):
    r = post_tryon(client, {"person_image": person_b64, "garment_images": []})
    assert r.status_code == 400


def test_empty_body_is_rejected(client):
    r = client.post("/try-on", data="{}", content_type="application/json")
    assert r.status_code == 400


def test_too_many_garments_is_rejected(client, person_b64, garment_b64):
    """
    Each garment is a sequential Vertex call of up to VERTEX_TIMEOUT, so an
    unbounded list is a guaranteed worker timeout.
    """
    r = post_tryon(client, {"person_image": person_b64,
                            "garment_images": [garment_b64] * 25})
    assert r.status_code == 400
    assert "too many" in r.get_json()["error"].lower()


# ── response contract ───────────────────────────────────────────────────────

def test_valid_request_returns_usable_image(client, person_b64, garment_b64):
    r = post_tryon(client, {"person_image": person_b64, "garment_image": garment_b64})
    assert r.status_code == 200
    body = r.get_json()
    assert body["success"] is True
    assert body["result_image"].startswith("data:image/")
    assert len(body["result_image"]) > 100


def test_response_declares_which_engine_ran(client, person_b64, garment_b64):
    """
    The UI shows 'Preview Only -- AI Fitting Unavailable' off this field. If it
    goes missing a flat composite silently poses as a real AI render.
    """
    body = post_tryon(client, {"person_image": person_b64,
                               "garment_image": garment_b64}).get_json()
    assert body["mode"] in ("vertex", "local")
    if body["mode"] == "local":
        assert body.get("fallback_reason"), "local mode must say why Vertex was skipped"


def test_declared_mime_matches_actual_payload(client, person_b64, garment_b64):
    """A data: URL claiming PNG while carrying JPEG bytes breaks some clients."""
    import base64
    import io
    from PIL import Image

    body = post_tryon(client, {"person_image": person_b64,
                               "garment_image": garment_b64}).get_json()
    header, payload = body["result_image"].split(",", 1)
    declared = header.split(";")[0].replace("data:image/", "").upper()
    actual = Image.open(io.BytesIO(base64.b64decode(payload))).format
    assert actual == ("JPEG" if declared in ("JPEG", "JPG") else declared), \
        f"declared {declared} but payload is {actual}"


def test_accepts_browser_data_urls(client, person_b64, garment_b64):
    """react-webcam hands over 'data:image/jpeg;base64,...', not raw base64."""
    r = post_tryon(client, {"person_image": data_url(person_b64, "image/jpeg"),
                            "garment_image": data_url(garment_b64)})
    assert r.status_code == 200
    assert r.get_json()["success"] is True


def test_undecodable_person_image_fails_loudly(client, garment_b64):
    """
    Previously the compositor swallowed the error and echoed the input back, so
    the customer received their own photo, unmodified, reported as success.
    """
    r = post_tryon(client, {"person_image": "###not-an-image###",
                            "garment_image": garment_b64})
    body = r.get_json()
    assert body["success"] is False, "garbage input must not report success"
    assert r.status_code >= 400


def test_multiple_garments_accepted(client, person_b64, garment_b64):
    r = post_tryon(client, {"person_image": person_b64,
                            "garment_images": [garment_b64, garment_b64]})
    assert r.status_code == 200


# ── other endpoints ─────────────────────────────────────────────────────────

def test_health(client):
    body = client.get("/health").get_json()
    assert body["status"] == "ok"


def test_book_demo_rejects_empty_body(client):
    r = client.post("/api/book-demo", data="{}", content_type="application/json")
    assert r.status_code >= 400


def test_book_demo_without_smtp_config_does_not_claim_success(client, monkeypatch):
    """A booking that was never emailed must not report success to the customer."""
    monkeypatch.delenv("SMTP_USER", raising=False)
    monkeypatch.delenv("SMTP_PASS", raising=False)
    monkeypatch.delenv("SMTP_PASSWORD", raising=False)
    r = client.post("/api/book-demo",
                    data=json.dumps({"fullName": "Test", "email": "t@example.com"}),
                    content_type="application/json")
    assert r.get_json().get("success") is not True
