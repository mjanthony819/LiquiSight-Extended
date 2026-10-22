"""API contract tests for the LiquiSight backend. No AI keys required."""
import io

import pytest
from fastapi.testclient import TestClient
from PIL import Image

import main
from chart_analyzer import (
    _extract_first_json_object,
    _get_demo_response,
    _parse_ai_response,
    _validate_result,
)


@pytest.fixture()
def client(monkeypatch):
    for key in ("OPENROUTER_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY", "LIQUISIGHT_DEBUG"):
        monkeypatch.delenv(key, raising=False)
    return TestClient(main.app)


def _png_bytes(color=(30, 90, 160)):
    buf = io.BytesIO()
    Image.new("RGB", (64, 48), color).save(buf, format="PNG")
    return buf.getvalue()


def test_health_reports_no_providers_without_keys(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["openrouter_configured"] is False
    assert body["openai_configured"] is False
    assert body["gemini_configured"] is False
    assert body["debug_enabled"] is False


def test_health_reflects_env_keys(client, monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")
    monkeypatch.setenv("LIQUISIGHT_DEBUG", "true")
    body = client.get("/health").json()
    assert body["openai_configured"] is True
    assert body["openrouter_configured"] is False
    assert body["debug_enabled"] is True


def test_chat_rejects_blank_message(client):
    assert client.post("/chat", json={"message": "   "}).status_code == 400


def test_chat_without_any_provider_is_503(client):
    r = client.post("/chat", json={"message": "hello"})
    assert r.status_code == 503
    assert "No AI provider configured" in r.json()["detail"]


def test_analyze_requires_an_image(client):
    assert client.post("/analyze").status_code == 400


def test_analyze_returns_locked_contract(client, monkeypatch):
    def fake_analyze(image, stock_name=None):
        return {"stock_name": stock_name or "UNKNOWN", "trend": "Uptrend", "risk": "Medium",
                "confidence": 0.76, "explanation": "Higher highs with rising volatility."}
    monkeypatch.setattr(main, "analyze_chart", fake_analyze)
    r = client.post("/analyze", files={"file": ("chart.png", _png_bytes(), "image/png")},
                    data={"stock_name": "AAPL"})
    assert r.status_code == 200
    body = r.json()
    # Exact key set from contract.md (LOCKED)
    assert set(body) == {"stock_name", "trend", "risk", "confidence", "explanation"}
    assert body["stock_name"] == "AAPL" and body["trend"] == "Uptrend"


def test_analyze_runtime_error_becomes_502(client, monkeypatch):
    def boom(image, stock_name=None):
        raise RuntimeError("all providers down")
    monkeypatch.setattr(main, "analyze_chart", boom)
    r = client.post("/analyze", files={"file": ("chart.png", _png_bytes(), "image/png")})
    assert r.status_code == 502 and "all providers down" in r.json()["detail"]


def test_analyze_rejects_non_image_upload(client):
    r = client.post("/analyze", files={"file": ("notes.txt", b"definitely not an image", "text/plain")})
    assert r.status_code == 400


def test_analyze_rejects_truncated_image(client):
    r = client.post("/analyze", files={"file": ("chart.png", _png_bytes()[:48], "image/png")})
    assert r.status_code == 400


def test_extract_first_json_object_handles_nesting_and_strings():
    assert _extract_first_json_object('pre {"a": {"b": "}"}} post') == '{"a": {"b": "}"}}'
    with pytest.raises(ValueError):
        _extract_first_json_object("no object here")
    with pytest.raises(ValueError):
        _extract_first_json_object('{"unbalanced": ')


def test_parse_ai_response_accepts_plain_fenced_and_embedded_json():
    assert _parse_ai_response('{"trend": "Uptrend"}') == {"trend": "Uptrend"}
    assert _parse_ai_response('```json\n{"trend": "Sideways"}\n```') == {"trend": "Sideways"}
    embedded = 'My analysis: {"trend": "Downtrend", "risk": "High"} - hope it helps'
    assert _parse_ai_response(embedded) == {"trend": "Downtrend", "risk": "High"}


def test_validate_result_normalizes_to_contract():
    out = _validate_result({"trend": "wild", "risk": "extreme", "confidence": 1.7, "explanation": "  ok  "})
    assert out == {"trend": "Sideways", "risk": "Medium", "confidence": 1.0, "explanation": "ok"}
    assert _validate_result({})["confidence"] == 0.5
    assert _validate_result({"confidence": "bad"})["confidence"] == 0.5


def test_demo_response_is_deterministic_per_stock():
    a = _get_demo_response("TCS")
    b = _get_demo_response("TCS")
    assert a == b
    assert a["stock_name"] == "TCS"
    assert 0.30 <= a["confidence"] <= 0.40
    assert a["trend"] in {"Uptrend", "Downtrend", "Sideways"}
