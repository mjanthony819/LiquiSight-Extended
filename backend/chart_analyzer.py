"""
Chart Analysis Module using AI-based visual reasoning.
Analyzes stock chart images and returns structured insights.

Supports multiple AI providers with automatic fallback:
1. OpenRouter (if OPENROUTER_API_KEY is set)
2. OpenAI (if OPENAI_API_KEY is set)
3. Google Gemini (if GEMINI_API_KEY is set)
3. Demo mode (no API required)
"""

import base64
import io
import os
import json
import re
import random
from typing import Optional, TypedDict, Literal

from PIL import Image


def _debug_enabled() -> bool:
    return os.environ.get("LIQUISIGHT_DEBUG", "").strip() in {"1", "true", "True", "yes", "on"}


def _debug_log(message: str) -> None:
    if _debug_enabled():
        print(f"[LiquiSight] {message}", flush=True)


class AnalysisResult(TypedDict):
    stock_name: str
    trend: Literal["Uptrend", "Downtrend", "Sideways"]
    risk: Literal["Low", "Medium", "High"]
    confidence: float
    explanation: str


SYSTEM_PROMPT = """You are a professional stock chart analyst. Analyze the provided chart image and determine:

1. **Trend**: Is the overall price movement an "Uptrend", "Downtrend", or "Sideways"?
2. **Risk Level**: Based on volatility, pattern stability, and market conditions visible in the chart, is the risk "Low", "Medium", or "High"?
3. **Confidence**: How confident are you in this analysis? Use these guidelines:
   - High certainty visual patterns (clear trends, well-defined patterns) -> confidence >= 0.75
   - Some ambiguity (mixed signals, moderate clarity) -> confidence between 0.5 and 0.7
   - Unclear / noisy chart (low quality, conflicting patterns) -> confidence < 0.5
4. **Explanation**: Provide a clear, plain-English explanation of what you observe in the chart. Focus on factual observations like price movements, patterns, support/resistance levels, and volatility.

IMPORTANT RULES:
- Do NOT give buy/sell advice
- Do NOT make price predictions
- Do NOT speculate about future movements
- If uncertain, lower your confidence score rather than guessing
- Keep explanations factual and observation-based

Return ONLY a single JSON object (no markdown, no code fences, no extra keys) in this exact format:
{
  "trend": "Uptrend" | "Downtrend" | "Sideways",
  "risk": "Low" | "Medium" | "High",
  "confidence": <float between 0.0 and 1.0>,
  "explanation": "<your plain-English explanation>"
}"""


# Demo mode explanations for professional fallback responses
_DEMO_EXPLANATIONS = {
    "Uptrend": [
        "The chart displays a series of higher highs and higher lows, suggesting upward momentum. Volume patterns appear consistent with the price movement, though some consolidation zones are visible.",
        "Price action shows a general upward trajectory with periodic pullbacks to apparent support levels. The trend structure remains intact based on visible price patterns.",
        "The visible price movement indicates bullish momentum with the chart forming an ascending pattern. Some resistance levels are apparent near recent highs.",
    ],
    "Downtrend": [
        "The chart shows a pattern of lower highs and lower lows, indicating bearish pressure. Price appears to be respecting a descending trend structure.",
        "Visible price action suggests downward momentum with sellers in control. Support levels have been tested multiple times based on the chart pattern.",
        "The price movement displays weakness with consistent lower peaks. Volume and price patterns suggest continued selling pressure.",
    ],
    "Sideways": [
        "The chart shows price oscillating within a defined range, lacking clear directional bias. Both support and resistance levels appear to be holding.",
        "Price action indicates consolidation with no dominant trend visible. The range-bound movement suggests market indecision.",
        "The visible pattern shows horizontal price movement with multiple tests of both upper and lower boundaries. Breakout direction remains unclear.",
    ],
}


def _encode_image_to_base64(image: Image.Image) -> str:
    """Convert PIL Image to base64 string."""
    buffer = io.BytesIO()
    # Convert to RGB if necessary (handles RGBA, P mode, etc.)
    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")

    # Keep requests small and consistent for vision models
    max_dim = 1024
    if max(image.size) > max_dim:
        resized = image.copy()
        resized.thumbnail((max_dim, max_dim))
        image = resized

    image.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def _extract_first_json_object(text: str) -> str:
    """Extract the first balanced JSON object from text.

    Handles nested braces and ignores braces inside strings.
    """
    start = text.find("{")
    if start == -1:
        raise ValueError("No JSON object found")

    depth = 0
    in_string = False
    escape = False

    for idx in range(start, len(text)):
        ch = text[idx]

        if in_string:
            if escape:
                escape = False
                continue
            if ch == "\\":
                escape = True
                continue
            if ch == '"':
                in_string = False
            continue

        if ch == '"':
            in_string = True
            continue

        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : idx + 1]

    raise ValueError("Unbalanced JSON object")


def _parse_ai_response(response_text: str) -> dict:
    """Parse the AI response and extract JSON."""
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        json_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        # Try to find a balanced JSON object anywhere in the response
        extracted = _extract_first_json_object(response_text)
        return json.loads(extracted)


def _validate_result(result: dict) -> dict:
    """Validate and normalize the AI result to match the contract."""
    valid_trends = {"Uptrend", "Downtrend", "Sideways"}
    trend = result.get("trend", "Sideways")
    if trend not in valid_trends:
        trend = "Sideways"
    
    valid_risks = {"Low", "Medium", "High"}
    risk = result.get("risk", "Medium")
    if risk not in valid_risks:
        risk = "Medium"
    
    confidence = result.get("confidence", 0.5)
    try:
        confidence = float(confidence)
        confidence = max(0.0, min(1.0, confidence))
    except (TypeError, ValueError):
        confidence = 0.5
    
    explanation = result.get("explanation", "Unable to analyze the chart.")
    if not isinstance(explanation, str) or not explanation.strip():
        explanation = "Unable to analyze the chart."
    
    return {
        "trend": trend,
        "risk": risk,
        "confidence": round(confidence, 2),
        "explanation": explanation.strip(),
    }


def _get_demo_response(stock_name: str) -> AnalysisResult:
    """
    Generate a professional demo response when no API is available.
    Returns realistic-looking analysis with low confidence.
    """
    rng = random.Random(stock_name)
    trend = rng.choice(["Uptrend", "Downtrend", "Sideways"])
    risk_options = {"Uptrend": "Medium", "Downtrend": "High", "Sideways": "Low"}
    risk = risk_options[trend]
    confidence = round(rng.uniform(0.30, 0.40), 2)
    explanation = rng.choice(_DEMO_EXPLANATIONS[trend])
    
    return {
        "stock_name": stock_name,
        "trend": trend,
        "risk": risk,
        "confidence": confidence,
        "explanation": explanation,
    }


def _analyze_with_openrouter(image: Image.Image, stock_name: Optional[str]) -> Optional[dict]:
    """
    Analyze chart using OpenRouter (OpenAI-compatible API).
    Returns validated result dict or None on failure.
    """
    try:
        from openai import OpenAI
        
        api_key = os.environ.get("OPENROUTER_API_KEY")
        if not api_key:
            return None
        
        base_url = os.environ.get("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        # Use a free, multimodal model by default so local dev works without credits.
        model = os.environ.get("OPENROUTER_MODEL", "qwen/qwen-2.5-vl-7b-instruct:free")

        timeout_s = float(os.environ.get("OPENROUTER_TIMEOUT_S", os.environ.get("AI_REQUEST_TIMEOUT_S", "20")))
        client = OpenAI(api_key=api_key, base_url=base_url, timeout=timeout_s, max_retries=1)
        
        image_base64 = _encode_image_to_base64(image)
        user_message = f"Analyze this stock chart for {stock_name}." if stock_name else "Analyze this stock chart image."
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_message},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image_base64}",
                            },
                        },
                    ],
                },
            ],
            max_tokens=500,
            temperature=0.3,
        )
        
        ai_response = response.choices[0].message.content
        if not ai_response:
            return None
        
        parsed = _parse_ai_response(ai_response)
        return _validate_result(parsed)
        
    except Exception as e:
        _debug_log(f"openrouter analyze failed: {type(e).__name__}: {e}")
        return None


def _analyze_with_gemini(image: Image.Image, stock_name: Optional[str]) -> Optional[dict]:
    """
    Analyze chart using Google Gemini Vision API.
    Returns validated result dict or None on failure.
    """
    try:
        import google.generativeai as genai
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return None
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Convert PIL Image for Gemini
        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        
        user_message = f"Analyze this stock chart for {stock_name}." if stock_name else "Analyze this stock chart image."
        full_prompt = f"{SYSTEM_PROMPT}\n\n{user_message}"
        
        response = model.generate_content(
            [full_prompt, image],
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=500,
            ),
        )
        
        ai_response = response.text
        if not ai_response:
            return None
        
        parsed = _parse_ai_response(ai_response)
        return _validate_result(parsed)
        
    except Exception as e:
        _debug_log(f"gemini analyze failed: {type(e).__name__}: {e}")
        return None


def _analyze_with_openai(image: Image.Image, stock_name: Optional[str]) -> Optional[dict]:
    """Analyze chart using OpenAI's vision models.

    Uses OPENAI_API_KEY and optionally OPENAI_MODEL (defaults to gpt-4o-mini).
    Returns validated result dict or None on failure.
    """

    try:
        from openai import OpenAI

        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            return None

        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

        timeout_s = float(os.environ.get("OPENAI_TIMEOUT_S", os.environ.get("AI_REQUEST_TIMEOUT_S", "60")))
        client = OpenAI(api_key=api_key, timeout=timeout_s, max_retries=1)

        image_base64 = _encode_image_to_base64(image)
        user_message = f"Analyze this stock chart for {stock_name}." if stock_name else "Analyze this stock chart image."

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_message},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{image_base64}",
                        },
                    },
                ],
            },
        ]

        # Prefer strict JSON responses when supported.
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=500,
                temperature=0.3,
                response_format={"type": "json_object"},
            )
        except Exception:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=500,
                temperature=0.3,
            )

        ai_response = response.choices[0].message.content
        if not ai_response:
            return None

        parsed = _parse_ai_response(ai_response)
        return _validate_result(parsed)
    except Exception as e:
        _debug_log(f"openai analyze failed: {type(e).__name__}: {e}")
        return None


def analyze_chart(image: Image.Image, stock_name: Optional[str] = None) -> AnalysisResult:
    """
    Analyze a stock chart image using AI-based visual reasoning.
    
    Args:
        image: A PIL Image object containing the stock chart.
        stock_name: Optional stock ticker symbol (e.g., "AAPL").
    
    Returns:
        A dictionary following the analysis contract:
        {
            "stock_name": str,
            "trend": "Uptrend" | "Downtrend" | "Sideways",
            "risk": "Low" | "Medium" | "High",
            "confidence": float between 0.0 and 1.0,
            "explanation": str
        }
    """
    final_stock_name = stock_name if stock_name else "Unknown"

    enable_gemini_fallback = os.environ.get("ENABLE_GEMINI_FALLBACK", "").strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }

    enable_demo_fallback = os.environ.get("ENABLE_DEMO_FALLBACK", "").strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }

    providers_configured = bool(os.environ.get("OPENROUTER_API_KEY")) or bool(os.environ.get("OPENAI_API_KEY")) or (
        enable_gemini_fallback and bool(os.environ.get("GEMINI_API_KEY"))
    )

    _debug_log(
        "analyze_chart: "
        f"stock_name={final_stock_name!r} "
        f"keys={{openrouter:{bool(os.environ.get('OPENROUTER_API_KEY'))}, openai:{bool(os.environ.get('OPENAI_API_KEY'))}, gemini:{bool(os.environ.get('GEMINI_API_KEY'))}}} "
        f"enable_gemini_fallback={enable_gemini_fallback} "
        f"enable_demo_fallback={enable_demo_fallback}"
    )
    
    # Try OpenRouter first (if API key is set)
    if os.environ.get("OPENROUTER_API_KEY"):
        result = _analyze_with_openrouter(image, stock_name)
        if result:
            _debug_log("analyze_chart: provider=openrouter")
            return {
                "stock_name": final_stock_name,
                "trend": result["trend"],
                "risk": result["risk"],
                "confidence": result["confidence"],
                "explanation": result["explanation"],
            }
        _debug_log("analyze_chart: provider=openrouter failed, falling back")

    # Try OpenAI next (if API key is set)
    if os.environ.get("OPENAI_API_KEY"):
        result = _analyze_with_openai(image, stock_name)
        if result:
            _debug_log("analyze_chart: provider=openai")
            return {
                "stock_name": final_stock_name,
                "trend": result["trend"],
                "risk": result["risk"],
                "confidence": result["confidence"],
                "explanation": result["explanation"],
            }
        _debug_log("analyze_chart: provider=openai failed, falling back")
    
    # Try Gemini next only when explicitly enabled.
    if enable_gemini_fallback and os.environ.get("GEMINI_API_KEY"):
        result = _analyze_with_gemini(image, stock_name)
        if result:
            _debug_log("analyze_chart: provider=gemini")
            return {
                "stock_name": final_stock_name,
                "trend": result["trend"],
                "risk": result["risk"],
                "confidence": result["confidence"],
                "explanation": result["explanation"],
            }
        _debug_log("analyze_chart: provider=gemini failed, falling back")
    
    # Fall back to demo mode only when explicitly enabled OR when nothing is configured.
    if enable_demo_fallback or not providers_configured:
        _debug_log("analyze_chart: provider=demo")
        return _get_demo_response(final_stock_name)

    # Providers were configured but all failed: fail loudly so the UI doesn't look like it's using mock data.
    raise RuntimeError(
        "All AI providers failed. Enable LIQUISIGHT_DEBUG=1 to see provider errors in the backend logs, "
        "or set ENABLE_DEMO_FALLBACK=1 to allow demo responses."
    )
