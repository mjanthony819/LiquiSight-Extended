"""API contract tests for the LiquiSight backend. No AI keys required."""
import base64
import io

import pytest
from fastapi.testclient import TestClient
from PIL import Image

import main
import chart_analyzer as ca
from chart_analyzer import (
    _encode_image_to_base64,
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


def test_encode_image_converts_modes_and_caps_size():
    big = Image.new("RGBA", (3000, 2000), (10, 200, 30, 128))
    out = Image.open(io.BytesIO(base64.b64decode(_encode_image_to_base64(big))))
    assert out.format == "PNG" and out.mode == "RGB"  # alpha dropped, vision models get plain RGB
    assert max(out.size) <= 1024  # requests stay small and consistent


def test_encode_image_leaves_small_images_alone():
    small = Image.new("L", (100, 80), 200)
    out = Image.open(io.BytesIO(base64.b64decode(_encode_image_to_base64(small))))
    assert out.size == (100, 80)


def _chart():
    return Image.new("RGB", (64, 48), (30, 90, 160))


def test_analyze_chart_uses_demo_when_nothing_configured(monkeypatch):
    for key in ("OPENROUTER_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY"):
        monkeypatch.delenv(key, raising=False)
    out = ca.analyze_chart(_chart(), "TCS")
    assert out["stock_name"] == "TCS"
    assert 0.30 <= out["confidence"] <= 0.40  # demo band: the UI can tell it apart from a real read


def test_analyze_chart_skips_gemini_unless_explicitly_enabled(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setenv("GEMINI_API_KEY", "gm-test")
    calls = []

    def gemini(image, stock_name=None):
        calls.append("gemini")
        return {"trend": "Uptrend", "risk": "Low", "confidence": 0.9, "explanation": "x"}

    monkeypatch.setattr(ca, "_analyze_with_gemini", gemini)
    out = ca.analyze_chart(_chart(), "TCS")  # fallback flag off: gemini key alone is not enough
    assert calls == [] and out["confidence"] <= 0.40  # fell through to demo instead
    monkeypatch.setenv("ENABLE_GEMINI_FALLBACK", "1")
    out = ca.analyze_chart(_chart(), "TCS")
    assert calls == ["gemini"] and out["confidence"] == 0.9


def test_analyze_chart_openai_beats_gemini_in_fallback_order(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")
    monkeypatch.setenv("GEMINI_API_KEY", "gm-test")
    monkeypatch.setenv("ENABLE_GEMINI_FALLBACK", "1")
    calls = []
    monkeypatch.setattr(ca, "_analyze_with_openai",
                        lambda image, stock_name=None: calls.append("openai") or
                        {"trend": "Sideways", "risk": "Low", "confidence": 0.8, "explanation": "x"})
    monkeypatch.setattr(ca, "_analyze_with_gemini",
                        lambda image, stock_name=None: calls.append("gemini") or
                        {"trend": "Uptrend", "risk": "High", "confidence": 0.9, "explanation": "y"})
    out = ca.analyze_chart(_chart())
    assert calls == ["openai"] and out["trend"] == "Sideways"  # first working provider wins


def test_analyze_chart_raises_loudly_when_providers_configured_but_all_fail(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "or-test")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("ENABLE_DEMO_FALLBACK", raising=False)
    monkeypatch.setattr(ca, "_analyze_with_openrouter", lambda image, stock_name=None: None)
    with pytest.raises(RuntimeError):
        ca.analyze_chart(_chart())
    monkeypatch.setenv("ENABLE_DEMO_FALLBACK", "1")
    out = ca.analyze_chart(_chart())  # explicit opt-in: demo is acceptable again
    assert 0.30 <= out["confidence"] <= 0.40


def test_chat_returns_openrouter_reply_when_configured(client, monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "or-test")
    monkeypatch.setattr(main, "_chat_with_openrouter", lambda message, **kw: "router reply")
    monkeypatch.setattr(main, "_chat_with_openai", lambda message, **kw: "openai reply")
    r = client.post("/chat", json={"message": "hi"})
    assert r.status_code == 200 and r.json()["reply"] == "router reply"


def test_chat_falls_back_to_openai_on_openrouter_failure(client, monkeypatch):
    from fastapi import HTTPException
    monkeypatch.setenv("OPENROUTER_API_KEY", "or-test")
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")

    def boom(message, **kw):
        raise HTTPException(status_code=402, detail="Insufficient credits")
    monkeypatch.setattr(main, "_chat_with_openrouter", boom)
    monkeypatch.setattr(main, "_chat_with_openai", lambda message, **kw: "openai reply")
    r = client.post("/chat", json={"message": "hi"})
    assert r.status_code == 200 and r.json()["reply"] == "openai reply"


def test_chat_does_not_fall_back_on_client_error(client, monkeypatch):
    from fastapi import HTTPException
    monkeypatch.setenv("OPENROUTER_API_KEY", "or-test")
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")

    def boom(message, **kw):
        raise HTTPException(status_code=400, detail="model not found")
    monkeypatch.setattr(main, "_chat_with_openrouter", boom)
    called = []
    monkeypatch.setattr(main, "_chat_with_openai", lambda message, **kw: called.append(1) or "x")
    r = client.post("/chat", json={"message": "hi"})
    assert r.status_code == 400 and called == []  # a config error surfaces, it does not silently switch providers


def test_analyze_accepts_legacy_image_field_name(client, monkeypatch):
    def fake_analyze(image, stock_name=None):
        return {"stock_name": "X", "trend": "Sideways", "risk": "Low",
                "confidence": 0.5, "explanation": "Range-bound."}
    monkeypatch.setattr(main, "analyze_chart", fake_analyze)
    r = client.post("/analyze", files={"image": ("chart.png", _png_bytes(), "image/png")})
    assert r.status_code == 200 and r.json()["trend"] == "Sideways"


def test_demo_response_risk_mapping_matches_trend():
    seen = {}
    for i in range(200):  # seeded by name: find one name per trend, deterministically
        r = _get_demo_response(f"STOCK{i}")
        seen.setdefault(r["trend"], r)
    assert set(seen) == {"Uptrend", "Downtrend", "Sideways"}
    assert seen["Uptrend"]["risk"] == "Medium"
    assert seen["Downtrend"]["risk"] == "High"
    assert seen["Sideways"]["risk"] == "Low"
    for trend, r in seen.items():
        assert r["explanation"] in ca._DEMO_EXPLANATIONS[trend]


def test_analyze_chart_openrouter_wins_when_configured(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "or-test")
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")
    calls = []
    monkeypatch.setattr(ca, "_analyze_with_openrouter",
                        lambda image, stock_name=None: calls.append("router") or
                        {"trend": "Uptrend", "risk": "Medium", "confidence": 0.9, "explanation": "x"})
    monkeypatch.setattr(ca, "_analyze_with_openai",
                        lambda image, stock_name=None: calls.append("openai") or
                        {"trend": "Sideways", "risk": "Low", "confidence": 0.5, "explanation": "y"})
    out = ca.analyze_chart(_chart(), "TCS")
    assert calls == ["router"] and out["trend"] == "Uptrend"  # first configured provider wins


def test_validate_result_parses_numeric_string_confidence():
    assert _validate_result({"confidence": "0.83"})["confidence"] == 0.83
    assert _validate_result({"confidence": "-1"})["confidence"] == 0.0   # clamped, not rejected
    assert _validate_result({"confidence": "1.5"})["confidence"] == 1.0
