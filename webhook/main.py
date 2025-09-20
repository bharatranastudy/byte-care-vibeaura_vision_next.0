from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from fastapi.responses import PlainTextResponse
import httpx

app = FastAPI(title="SIH Health Bot Webhook")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
def index():
    return {"status": "ok", "service": "webhook", "endpoints": ["/health", "/twilio", "/gupshup"]}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/twilio")
async def twilio_webhook(request: Request):
    form = await request.form()
    from_number = form.get("From")
    body = form.get("Body", "")
    # Forward to Rasa REST webhook
    rasa_url = os.getenv("RASA_URL", "http://rasa:5005/webhooks/rest/webhook")
    payload = {"sender": from_number or "twilio-user", "message": body}
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.post(rasa_url, json=payload)
            r.raise_for_status()
            messages = r.json()
        except Exception as e:
            return {"error": str(e), "forwarded_to": rasa_url}
    # Twilio expects string body; we return structured for now
    return {"received_from": from_number, "body": body, "replies": messages}

@app.post("/gupshup")
async def gupshup_webhook(payload: dict):
    # Gupshup payloads can vary; attempt generic extraction
    sender = payload.get("sender", payload.get("phone", "gupshup-user"))
    text = payload.get("text") or payload.get("message") or payload.get("payload", {}).get("text", "")
    rasa_url = os.getenv("RASA_URL", "http://rasa:5005/webhooks/rest/webhook")
    data = {"sender": sender, "message": text}
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            r = await client.post(rasa_url, json=data)
            r.raise_for_status()
            messages = r.json()
        except Exception as e:
            return {"error": str(e), "forwarded_to": rasa_url}
    return {"received": payload, "replies": messages}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return PlainTextResponse("", media_type="image/x-icon")













