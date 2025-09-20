"""
Simplified FastAPI Actions Server for SIH Health Bot
Basic server to get the application running
"""

from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime
import hmac
import hashlib

try:
    import pytesseract  # optional OCR
    from PIL import Image
    PYTESS_AVAILABLE = True
except Exception:
    PYTESS_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SIH Health Bot Actions Server",
    description="Simplified FastAPI server for SIH Health Bot",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SIH Health Bot Actions Server is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "actions-server"
    }

@app.post("/webhook")
async def webhook():
    return {"message": "Webhook endpoint ready"}

@app.get("/api/symptoms")
async def get_symptoms():
    return {
        "symptoms": [
            "fever", "cough", "headache", "fatigue", "nausea",
            "body_ache", "sore_throat", "runny_nose", "shortness_of_breath"
        ]
    }

@app.post("/api/analyze-symptoms")
async def analyze_symptoms(symptoms: Dict[str, Any]):
    return {
        "analysis": "Basic symptom analysis completed",
        "recommendations": ["Rest", "Stay hydrated", "Monitor symptoms"],
        "severity": "mild"
    }

@app.get("/api/vaccination-centers")
async def get_vaccination_centers():
    return {
        "centers": [
            {"name": "City Hospital", "address": "123 Main St", "available_slots": 10},
            {"name": "Community Health Center", "address": "456 Oak Ave", "available_slots": 5}
        ]
    }

@app.post("/api/book-vaccination")
async def book_vaccination(booking: Dict[str, Any]):
    return {
        "booking_id": "VAC123456",
        "status": "confirmed",
        "message": "Vaccination appointment booked successfully"
    }

# =====================
# Outbreaks + HMAC Webhook
# =====================
OUTBREAK_HMAC_SECRET = os.getenv("OUTBREAK_HMAC_SECRET", "dev-secret-change-me").encode()

def verify_hmac_signature(raw_body: bytes, signature_header: Optional[str]) -> bool:
    """Verify header in format 'sha256=HEX_DIGEST' against OUTBREAK_HMAC_SECRET."""
    if not signature_header:
        return False
    try:
        scheme, provided = signature_header.split("=", 1)
    except ValueError:
        return False
    if scheme.lower() != "sha256":
        return False
    digest = hmac.new(OUTBREAK_HMAC_SECRET, raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, provided)


@app.post("/webhook/outbreaks")
async def outbreaks_webhook(request: Request, x_signature: Optional[str] = Header(None)):
    raw = await request.body()
    if not verify_hmac_signature(raw, x_signature):
        logger.warning("Invalid HMAC signature on outbreaks webhook")
        raise HTTPException(status_code=401, detail="Invalid signature")
    payload = await request.json()
    # TODO: persist payload to DB / cache and notify channels
    logger.info(f"Received verified outbreak webhook: {payload}")
    return {"status": "ok"}


@app.get("/api/outbreaks")
async def get_outbreaks(state: Optional[str] = None, district: Optional[str] = None):
    """Fetch outbreaks from MoHFW/IDSP (stubbed for now)."""
    sample = [
        {
            "title": "Dengue Outbreak",
            "severity": "high",
            "location": f"{district or 'Central'} {state or 'Delhi'}",
            "cases": 128,
            "date": datetime.now().date().isoformat(),
            "status": "active",
            "source": "MoHFW/IDSP"
        }
    ]
    return {"alerts": sample}


# =====================
# Rewards (Blockchain stub)
# =====================
@app.post("/api/rewards/award")
async def award_rewards(data: Dict[str, Any]):
    """Stub: award tokens using on-chain RewardManager in production."""
    user_wallet = data.get("user_wallet")
    reason = data.get("reason", "engagement")
    amount = int(data.get("amount", 0))
    if not user_wallet or amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid payload")
    logger.info(f"Rewards stub => user={user_wallet} amount={amount} reason={reason}")
    return {"status": "queued", "tx": None}


# =====================
# OCR / Image Analysis (placeholders)
# =====================
@app.post("/api/ocr/medicine")
async def ocr_medicine(payload: Dict[str, Any]):
    # Implement base64 decoding + pytesseract when available
    if PYTESS_AVAILABLE:
        logger.info("pytesseract available: wire actual OCR in production")
    return {
        "medicineName": "Ibuprofen 400mg",
        "manufacturer": "HealthCare Ltd.",
        "batchNumber": "IBU2024A1",
        "expiryDate": "2026-03-15",
        "dosage": "400mg",
        "warnings": "Do not exceed recommended dose"
    }


@app.post("/api/image/analyze")
async def image_analyze(payload: Dict[str, Any]):
    return {
        "tags": ["rash", "redness"],
        "confidence": 0.62,
        "recommendations": [
            "Monitor area for 24-48 hours",
            "Avoid scratching; keep area clean",
            "Consult a clinician if symptoms worsen"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
