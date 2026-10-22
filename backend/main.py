import io
import os

from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    def load_dotenv(*_args, **_kwargs):
        return False


def _load_env_files() -> None:
    """Load environment variables from .env files.

    This makes local dev resilient to different working directories.
    """

    repo_root = Path(__file__).resolve().parent.parent
    env_path = repo_root / ".env"

    try:
        if env_path.exists():
            load_dotenv(env_path, override=False)
    except (OSError, ValueError):
        # Never fail startup just because an env file can't be read.
        pass


_load_env_files()

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal
from PIL import Image

try:
    from .chart_analyzer import analyze_chart
except ImportError:  # pragma: no cover
    # Fallback for running from within the backend/ directory
    from chart_analyzer import analyze_chart

app = FastAPI(title="LiquiSight API", version="1.0.0")

# Enable CORS for extension and web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisResponse(BaseModel):
    stock_name: str
    trend: str
    risk: str
    confidence: float
    explanation: str


class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    image_base64: Optional[str] = None
    image_mime: Optional[Literal["image/png", "image/jpeg", "image/webp"]] = "image/png"


class ChatResponse(BaseModel):
    reply: str


class HealthResponse(BaseModel):
    status: Literal["ok"]
    openrouter_configured: bool
    openai_configured: bool
    gemini_configured: bool
    debug_enabled: bool


def _chat_with_openrouter(
    message: str,
    *,
    context: Optional[str] = None,
    image_base64: Optional[str] = None,
    image_mime: str = "image/png",
) -> str:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY is not configured")

    base_url = os.environ.get("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    # Use a free, multimodal model by default so local dev works without credits.
    model = os.environ.get("OPENROUTER_MODEL", "qwen/qwen-2.5-vl-7b-instruct:free")

    try:
        from openai import OpenAI
    except ImportError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI client not available: {e}") from e

    system_prompt = (
        "You are LiquiSight, an AI financial copilot. "
        "Be concise, helpful, and use bullet points when listing multiple items. "
        "Do NOT provide direct financial advice. Speak in educational/informational terms."
    )

    user_text = message.strip()
    if context:
        user_text = f"Context: {context}\n\nUser: {user_text}"

    content = [{"type": "text", "text": user_text}]
    if image_base64:
        content.append(
            {
                "type": "image_url",
                "image_url": {"url": f"data:{image_mime};base64,{image_base64}"},
            }
        )

    timeout_s = float(os.environ.get("OPENROUTER_TIMEOUT_S", os.environ.get("AI_REQUEST_TIMEOUT_S", "20")))
    client = OpenAI(api_key=api_key, base_url=base_url, timeout=timeout_s, max_retries=1)
    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content},
            ],
            max_tokens=800,
            temperature=0.4,
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"OpenRouter request failed: {type(e).__name__}: {e}",
        ) from e

    reply = (resp.choices[0].message.content or "").strip()
    return reply or "Sorry — I couldn't generate a response right now."


def _chat_with_openai(
    message: str,
    *,
    context: Optional[str] = None,
    image_base64: Optional[str] = None,
    image_mime: str = "image/png",
) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured")

    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    try:
        from openai import OpenAI
    except ImportError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI client not available: {e}") from e

    system_prompt = (
        "You are LiquiSight, an AI financial copilot. "
        "Be concise, helpful, and use bullet points when listing multiple items. "
        "Do NOT provide direct financial advice. Speak in educational/informational terms."
    )

    user_text = message.strip()
    if context:
        user_text = f"Context: {context}\n\nUser: {user_text}"

    content = [{"type": "text", "text": user_text}]
    if image_base64:
        content.append(
            {
                "type": "image_url",
                "image_url": {"url": f"data:{image_mime};base64,{image_base64}"},
            }
        )

    timeout_s = float(os.environ.get("OPENAI_TIMEOUT_S", os.environ.get("AI_REQUEST_TIMEOUT_S", "60")))
    client = OpenAI(api_key=api_key, timeout=timeout_s, max_retries=1)
    try:
        resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content},
            ],
            max_tokens=800,
            temperature=0.4,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI request failed: {type(e).__name__}: {e}") from e

    reply = (resp.choices[0].message.content or "").strip()
    return reply or "Sorry — I couldn't generate a response right now."


def _chat_generate(
    message: str,
    *,
    context: Optional[str] = None,
    image_base64: Optional[str] = None,
    image_mime: str = "image/png",
) -> str:
    """Generate a chat reply.

    Prefer OpenRouter when configured, but fall back to OpenAI when OpenRouter fails
    (common in local dev when the OpenRouter account has no credits).
    """

    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    if openrouter_key:
        try:
            return _chat_with_openrouter(
                message,
                context=context,
                image_base64=image_base64,
                image_mime=image_mime,
            )
        except HTTPException as e:
            detail = str(getattr(e, "detail", "") or "")
            # Typical OpenRouter failure for new accounts; fall back if possible.
            if "Insufficient credits" in detail or e.status_code in {401, 402, 429, 500, 502, 503}:
                if os.environ.get("OPENAI_API_KEY"):
                    return _chat_with_openai(
                        message,
                        context=context,
                        image_base64=image_base64,
                        image_mime=image_mime,
                    )
            raise

    # No OpenRouter configured: use OpenAI if available.
    if os.environ.get("OPENAI_API_KEY"):
        return _chat_with_openai(
            message,
            context=context,
            image_base64=image_base64,
            image_mime=image_mime,
        )

    raise HTTPException(status_code=503, detail="No AI provider configured (set OPENROUTER_API_KEY or OPENAI_API_KEY)")


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    context: Optional[str] = Form(None),
    stock_name: Optional[str] = Form(None),
):
    """
    Analyze a stock chart image and return insights.
    
    - **file**: Optional chart image file (preferred field name)
    - **image**: Optional chart image file (backward compatible)
    - **context**: Optional free-form context string
    - **stock_name**: Optional stock ticker symbol
    
    Returns analysis result per the locked API contract.
    """
    upload = file or image

    if upload is None:
        raise HTTPException(status_code=400, detail="Image file is required")
    
    # Read and convert uploaded file to PIL Image
    contents = await upload.read()
    try:
        pil_image = Image.open(io.BytesIO(contents))
        pil_image.load()  # decode now so truncated files fail here, not mid-analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image") from e
    
    # Analyze the chart using the AI analyzer
    # `context` is accepted for extension clients; backend analysis contract stays the same.
    _ = context
    try:
        result = analyze_chart(pil_image, stock_name=stock_name)
        return AnalysisResponse(**result)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    reply = _chat_generate(
        payload.message,
        context=payload.context,
        image_base64=payload.image_base64,
        image_mime=payload.image_mime or "image/png",
    )

    return ChatResponse(reply=reply)


@app.get("/health", response_model=HealthResponse)
async def health():
    debug_enabled = os.environ.get("LIQUISIGHT_DEBUG", "").strip() in {"1", "true", "True", "yes", "on"}
    return HealthResponse(
        status="ok",
        openrouter_configured=bool(os.environ.get("OPENROUTER_API_KEY")),
        openai_configured=bool(os.environ.get("OPENAI_API_KEY")),
        gemini_configured=bool(os.environ.get("GEMINI_API_KEY")),
        debug_enabled=debug_enabled,
    )
