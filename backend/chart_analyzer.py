"""
Chart Analysis Module using AI-based visual reasoning.
Analyzes stock chart images and returns structured insights.
"""

import base64
import io
import os
import json
import re
from typing import Optional, TypedDict, Literal

from PIL import Image


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

Respond ONLY with valid JSON in this exact format:
{
  "trend": "Uptrend" | "Downtrend" | "Sideways",
  "risk": "Low" | "Medium" | "High",
  "confidence": <float between 0.0 and 1.0>,
  "explanation": "<your plain-English explanation>"
}"""


def _encode_image_to_base64(image: Image.Image) -> str:
    """Convert PIL Image to base64 string."""
    buffer = io.BytesIO()
    # Convert to RGB if necessary (handles RGBA, P mode, etc.)
    if image.mode not in ("RGB", "L"):
        image = image.convert("RGB")
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def _parse_ai_response(response_text: str) -> dict:
    """Parse the AI response and extract JSON."""
    # Try to find JSON in the response
    try:
        # First, try direct JSON parse
        return json.loads(response_text)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        json_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        # Try to find raw JSON object
        json_match = re.search(r"\{[^{}]*\}", response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(0))
        raise ValueError("Could not parse JSON from AI response")


def _validate_result(result: dict) -> dict:
    """Validate and normalize the AI result to match the contract."""
    # Validate trend
    valid_trends = {"Uptrend", "Downtrend", "Sideways"}
    trend = result.get("trend", "Sideways")
    if trend not in valid_trends:
        trend = "Sideways"
    
    # Validate risk
    valid_risks = {"Low", "Medium", "High"}
    risk = result.get("risk", "Medium")
    if risk not in valid_risks:
        risk = "Medium"
    
    # Validate confidence
    confidence = result.get("confidence", 0.5)
    try:
        confidence = float(confidence)
        confidence = max(0.0, min(1.0, confidence))
    except (TypeError, ValueError):
        confidence = 0.5
    
    # Validate explanation
    explanation = result.get("explanation", "Unable to analyze the chart.")
    if not isinstance(explanation, str) or not explanation.strip():
        explanation = "Unable to analyze the chart."
    
    return {
        "trend": trend,
        "risk": risk,
        "confidence": round(confidence, 2),
        "explanation": explanation.strip(),
    }


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
    # Use provided stock_name or default to "Unknown"
    final_stock_name = stock_name if stock_name else "Unknown"
    
    # Default fallback response for errors
    fallback_response: AnalysisResult = {
        "stock_name": final_stock_name,
        "trend": "Sideways",
        "risk": "Medium",
        "confidence": 0.0,
        "explanation": "Unable to analyze the chart due to an error.",
    }
    
    try:
        # Import OpenAI here to handle missing dependency gracefully
        from openai import OpenAI
        
        # Get API key from environment
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            fallback_response["explanation"] = "OpenAI API key not configured."
            return fallback_response
        
        client = OpenAI(api_key=api_key)
        
        # Encode image to base64
        image_base64 = _encode_image_to_base64(image)
        
        # Build the user message with context
        user_message = "Analyze this stock chart image."
        if stock_name:
            user_message = f"Analyze this stock chart for {stock_name}."
        
        # Call the vision model
        response = client.chat.completions.create(
            model="gpt-4o",
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
                                "detail": "high",
                            },
                        },
                    ],
                },
            ],
            max_tokens=500,
            temperature=0.3,
        )
        
        # Extract and parse the response
        ai_response = response.choices[0].message.content
        if not ai_response:
            fallback_response["explanation"] = "AI returned an empty response."
            return fallback_response
        
        # Parse and validate the response
        parsed = _parse_ai_response(ai_response)
        validated = _validate_result(parsed)
        
        # Build final result
        result: AnalysisResult = {
            "stock_name": final_stock_name,
            "trend": validated["trend"],
            "risk": validated["risk"],
            "confidence": validated["confidence"],
            "explanation": validated["explanation"],
        }
        
        return result
        
    except ImportError:
        fallback_response["explanation"] = "OpenAI library not installed. Run: pip install openai"
        return fallback_response
    except Exception as e:
        fallback_response["explanation"] = f"Analysis failed: {str(e)}"
        return fallback_response
