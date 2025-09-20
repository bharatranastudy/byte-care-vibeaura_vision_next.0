from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict
import uvicorn

app = FastAPI(title="SIH Health Bot ML Service")

class ForecastRequest(BaseModel):
    series: List[float]
    horizon: int = 7

@app.get("/")
def root():
    return {"message": "SIH Health Bot ML Service is running!", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    return {"text": "OCR functionality available", "filename": file.filename}

@app.post("/forecast")
def forecast(req: ForecastRequest):
    # Simple forecast stub
    avg = sum(req.series[-3:]) / 3 if len(req.series) >= 3 else sum(req.series) / len(req.series)
    forecast_values = [avg] * req.horizon
    return {"forecast": forecast_values, "horizon": req.horizon}

@app.post("/analyze-medicine")
async def analyze_medicine(file: UploadFile = File(...)):
    return {
        "medicine_name": "Sample Medicine",
        "dosage": "500mg",
        "instructions": "Take twice daily with food"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
