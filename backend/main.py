from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

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


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    image: Optional[UploadFile] = File(None),
    stock_name: Optional[str] = Form(None),
):
    """
    Analyze a stock chart image and return insights.
    
    - **image**: Optional chart image file
    - **stock_name**: Optional stock ticker symbol
    
    Returns a fixed response per the locked API contract.
    """
    return AnalysisResponse(
        stock_name="AAPL",
        trend="Uptrend",
        risk="Medium",
        confidence=0.76,
        explanation="The chart shows higher highs with increasing volatility, indicating an uptrend with moderate risk of pullback.",
    )
