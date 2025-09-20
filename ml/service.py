from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import pytesseract
import cv2
import numpy as np
from typing import List, Dict
from fastapi.responses import PlainTextResponse

app = FastAPI(title="SIH Health Bot ML Service")

class ForecastRequest(BaseModel):
    series: List[float]
    horizon: int = 7

@app.get("/", include_in_schema=False)
def index():
    return {"status": "ok", "service": "ml-service", "endpoints": ["/health", "/ocr", "/forecast"]}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    content = await file.read()
    arr = np.frombuffer(content, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    text = pytesseract.image_to_string(img)
    return {"text": text}

@app.post("/forecast")
def forecast(req: ForecastRequest):
    # Minimal stub forecaster: moving average continuation
    series = req.series
    window = min(7, len(series))
    avg = sum(series[-window:]) / window if series else 0.0
    pred = [avg for _ in range(req.horizon)]
    return {"forecast": pred}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return PlainTextResponse("", media_type="image/x-icon")













