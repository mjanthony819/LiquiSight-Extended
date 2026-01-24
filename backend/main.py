import io

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from PIL import Image

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


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    image: Optional[UploadFile] = File(None),
    stock_name: Optional[str] = Form(None),
):
    """
    Analyze a stock chart image and return insights.
    
    - **image**: Optional chart image file
    - **stock_name**: Optional stock ticker symbol
    
    Returns analysis result per the locked API contract.
    """
    if image is None:
        raise HTTPException(status_code=400, detail="Image file is required")
    
    # Read and convert uploaded file to PIL Image
    contents = await image.read()
    pil_image = Image.open(io.BytesIO(contents))
    
    # Analyze the chart using the AI analyzer
    result = analyze_chart(pil_image, stock_name=stock_name)
    
    return AnalysisResponse(**result)
