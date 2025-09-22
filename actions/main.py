"""
FastAPI Actions Server for SIH Health Bot
Handles custom Rasa actions, government API integration, and HMAC validation
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import os
import openai
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any, Optional
import logging
import hmac
import hashlib
import json
from datetime import datetime, timedelta

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict

from database import get_db, init_db
from database import User, SymptomReport, VaccinationRecord, RewardTransaction
from services import (
    HealthAnalysisService,
    VaccinationService,
    OutbreakService,
)
# Optional services: import if present; otherwise set to None so app still starts
try:
    from services import (
        MedicineService,
        RewardService,
        LanguageService,
        ImageAnalysisService,
        VoiceProcessingService,
        MedicineScanService,
        HealthQuizService,
        AppointmentService,
    )
except Exception:
    MedicineService = None
    RewardService = None
    LanguageService = None
    ImageAnalysisService = None
    VoiceProcessingService = None
    MedicineScanService = None
    HealthQuizService = None
    AppointmentService = None
from auth import verify_hmac_signature
from config import settings
from pydantic import BaseModel
from tasks import send_alert_task
from fastapi.responses import PlainTextResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()


# --- OpenAI API Key ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

# --- In-memory session store for web users (for demo; use Redis/DB for production) ---
web_user_histories = {}
from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# --- Webapp Chatbot API ---
class ChatRequest(BaseModel):
    user_id: str
    message: str

@app.post("/api/chat")
async def chat_api(req: ChatRequest):
    user_id = req.user_id
    user_message = req.message
    if not OPENAI_API_KEY:
        return JSONResponse({"error": "OpenAI API key not set."}, status_code=500)
    # Maintain conversation history for context (last 12 exchanges)
    history = web_user_histories.get(user_id, [])
    system_prompt = {
        "role": "system",
        "content": (
            "You are ByteCare, an advanced AI health assistant. "
            "You act like ChatGPT, providing deeply contextual, empathetic, and actionable health and wellness advice. "
            "You remember the user's previous context in this chat, and can summarize, clarify, and ask follow-up questions. "
            "Always be friendly, clear, and concise. If a question is outside your scope, recommend consulting a healthcare professional. "
            "If the user asks for a summary, provide a concise summary of the conversation so far. "
            "If the user shares symptoms, ask clarifying questions and suggest next steps. "
            "If the user asks for motivation or mental health support, provide encouragement and evidence-based advice. "
            "Always avoid repeating yourself verbatim in consecutive answers, and always tailor your response to the user's latest message."
        )
    }
    messages = [system_prompt]
    for h in history[-12:]:
        messages.append({"role": "user", "content": f"[User]: {h['user']}"})
        if h.get("assistant"):
            messages.append({"role": "assistant", "content": h["assistant"]})
    messages.append({"role": "user", "content": f"[User]: {user_message}"})
    try:
        # Save to history before call to help GPT-4 see the latest turn
        history.append({"user": user_message})
        web_user_histories[user_id] = history
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                max_tokens=1024,
                temperature=0.7
            )
        except Exception as e:
            # fallback to gpt-3.5-turbo if gpt-4 is not available
            logger.warning(f"Falling back to gpt-3.5-turbo: {e}")
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo-16k",
                messages=messages,
                max_tokens=1024,
                temperature=0.7
            )
        answer = response.choices[0].message["content"].strip()
        # Save assistant reply to history
        history[-1]["assistant"] = answer
        web_user_histories[user_id] = history
        return {"reply": answer}
    except Exception as e:
        logger.error(f"AI chat error: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)
    title="SIH Health Bot Actions Server",
    description="FastAPI server for handling Rasa custom actions and government API integration",
    version="1.0.0"


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root and favicon routes must be declared after app initialization
@app.get("/", include_in_schema=False)
async def index():
    return {
        "status": "ok",
        "service": "actions",
        "endpoints": [
            "/health",
            "/api/v1/alerts/",
            "/webhook",
            "/api/outbreaks",
            "/api/vaccination-schedule",
            "/api/outbreak-alert",
        ],
    }

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return PlainTextResponse("", media_type="image/x-icon")

# Security
security = HTTPBearer()

# Initialize database
@app.on_event("startup")
async def startup_event():
    await init_db()
    logger.info("Database initialized successfully")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Rasa webhook endpoint
@app.post("/webhook")
async def rasa_webhook(
    request: Dict[str, Any],
    background_tasks: BackgroundTasks,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Handle Rasa webhook requests with HMAC verification"""
    try:
        # Verify HMAC signature for government alerts
        if not verify_hmac_signature(request, credentials.credentials):
            raise HTTPException(status_code=401, detail="Invalid HMAC signature")
        
        # Process the request
        result = await process_rasa_request(request, background_tasks)
        return result
        
    except Exception as e:
        logger.error(f"Error processing Rasa webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Alerts API
class AlertRequest(BaseModel):
    user_id: str
    message: str


@app.post("/api/v1/alerts/")
async def create_alert(payload: AlertRequest):
    """Create an alert by enqueuing a Celery task.

    Accepts a JSON payload with `user_id` and `message`, enqueues
    `send_alert_task` via Celery, and returns the Celery task id.
    """
    try:
        async_result = send_alert_task.delay(user_id=payload.user_id, message=payload.message)
        return {"task_id": async_result.id}
    except Exception as e:
        logger.error(f"Failed to enqueue alert task: {e}")
        raise HTTPException(status_code=500, detail="Failed to enqueue alert task")

async def process_rasa_request(request: Dict[str, Any], background_tasks: BackgroundTasks):
    """Process incoming Rasa requests"""
    action_name = request.get("next_action")
    
    if action_name == "action_health_analysis":
        return await handle_health_analysis(request)
    elif action_name == "action_vaccination_schedule":
        return await handle_vaccination_schedule(request)
    elif action_name == "action_medicine_lookup":
        return await handle_medicine_lookup(request)
    elif action_name == "action_outbreak_check":
        return await handle_outbreak_check(request)
    elif action_name == "action_health_tips":
        return await handle_health_tips(request)
    elif action_name == "action_emergency_assessment":
        return await handle_emergency_assessment(request)
    elif action_name == "action_language_detection":
        return await handle_language_detection(request)
    elif action_name == "action_reward_calculation":
        return await handle_reward_calculation(request)
    elif action_name == "action_image_analysis":
        return await handle_image_analysis(request)
    elif action_name == "action_voice_processing":
        return await handle_voice_processing(request)
    elif action_name == "action_medicine_scan":
        return await handle_medicine_scan(request)
    elif action_name == "action_health_quiz":
        return await handle_health_quiz(request)
    elif action_name == "action_appointment_booking":
        return await handle_appointment_booking(request)
    else:
        return {"events": [], "responses": []}

# Action handlers
async def handle_health_analysis(request: Dict[str, Any]):
    """Handle health symptom analysis"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        symptoms = slots.get("current_symptoms", [])
        age = slots.get("user_age")
        gender = slots.get("user_gender")
        location = slots.get("user_location")
        
        health_service = HealthAnalysisService()
        analysis = await health_service.analyze_symptoms(
            symptoms=symptoms,
            age=age,
            gender=gender,
            location=location
        )
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Based on your symptoms, I recommend {analysis['recommendation']}. "
                           f"Severity level: {analysis['severity']}. "
                           f"Please consult a healthcare professional for proper diagnosis."
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in health analysis: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I'm sorry, I couldn't analyze your symptoms. Please try again."}]
        }

async def handle_vaccination_schedule(request: Dict[str, Any]):
    """Handle vaccination schedule queries"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        age = slots.get("user_age")
        location = slots.get("user_location")
        
        vaccination_service = VaccinationService()
        schedule = await vaccination_service.get_vaccination_schedule(
            age=age,
            location=location
        )
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Here's your vaccination schedule: {schedule['schedule']}. "
                           f"Next recommended vaccine: {schedule['next_vaccine']}"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in vaccination schedule: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't retrieve your vaccination schedule. Please try again."}]
        }

async def handle_medicine_lookup(request: Dict[str, Any]):
    """Handle medicine information queries"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        medicine_name = slots.get("medicine_name")
        if MedicineService is None:
            return {
                "events": [],
                "responses": [{"text": "Medicine lookup service is not enabled."}]
            }
        medicine_service = MedicineService()
        info = await medicine_service.get_medicine_info(medicine_name)
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Information about {medicine_name}: {info['description']}. "
                           f"Dosage: {info['dosage']}. Side effects: {info['side_effects']}"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in medicine lookup: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't find information about that medicine."}]
        }

async def handle_outbreak_check(request: Dict[str, Any]):
    """Handle outbreak alert checks"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        location = slots.get("user_location")
        
        outbreak_service = OutbreakService()
        alerts = await outbreak_service.check_outbreaks(location)
        
        if alerts:
            alert_text = "⚠️ Health Alert: "
            for alert in alerts:
                alert_text += f"{alert['disease']} outbreak in {alert['location']}. "
                alert_text += f"Cases: {alert['cases']}. "
                alert_text += f"Precautions: {alert['precautions']}. "
        else:
            alert_text = "No active health alerts in your area. Stay safe!"
        
        return {
            "events": [],
            "responses": [{"text": alert_text}]
        }
    except Exception as e:
        logger.error(f"Error in outbreak check: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't check for health alerts. Please try again."}]
        }

async def handle_health_tips(request: Dict[str, Any]):
    """Handle health tips requests"""
    try:
        health_service = HealthAnalysisService()
        tips = await health_service.get_health_tips()
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Here are some health tips: {tips['tips']}. "
                           f"Remember to stay hydrated, exercise regularly, and maintain a balanced diet."
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in health tips: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't retrieve health tips right now."}]
        }

async def handle_emergency_assessment(request: Dict[str, Any]):
    """Handle emergency situation assessment"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        symptoms = slots.get("current_symptoms", [])
        
        health_service = HealthAnalysisService()
        assessment = await health_service.assess_emergency(symptoms)
        
        if assessment['is_emergency']:
            response_text = f"🚨 EMERGENCY ALERT: {assessment['message']} " \
                          f"Please contact emergency services immediately or visit the nearest hospital. " \
                          f"Emergency number: 108"
        else:
            response_text = f"Based on your symptoms, this doesn't appear to be an emergency. " \
                          f"However, please consult a healthcare professional if symptoms persist."
        
        return {
            "events": [],
            "responses": [{"text": response_text}]
        }
    except Exception as e:
        logger.error(f"Error in emergency assessment: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "🚨 This seems like an emergency. Please contact emergency services immediately."}]
        }

async def handle_language_detection(request: Dict[str, Any]):
    """Handle language detection and switching"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        language = slots.get("language", "English")
        if LanguageService is None:
            return {"events": [], "responses": [{"text": "Language service is not enabled."}]}
        language_service = LanguageService()
        detected_language = await language_service.detect_language(tracker.get("latest_message", {}).get("text", ""))
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Language set to {language}. I'll now respond in {language}."
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in language detection: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I'll continue in English."}]
        }

async def handle_reward_calculation(request: Dict[str, Any]):
    """Handle reward calculation and distribution"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        user_id = tracker.get("sender_id")
        action_type = request.get("next_action", "general")
        
        if RewardService is None:
            return {"events": [], "responses": [{"text": "Reward service is not enabled."}]}
        reward_service = RewardService()
        reward = await reward_service.calculate_reward(user_id, action_type)
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"🎉 Congratulations! You've earned {reward['tokens']} health tokens for {reward['action']}. "
                           f"Your total balance: {reward['total_balance']} tokens."
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in reward calculation: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "Reward calculation failed. Please try again."}]
        }

async def handle_image_analysis(request: Dict[str, Any]):
    """Handle image analysis for symptoms"""
    try:
        tracker = request.get("tracker", {})
        if ImageAnalysisService is None:
            return {"events": [], "responses": [{"text": "Image analysis service is not enabled."}]}
        image_service = ImageAnalysisService()
        analysis = await image_service.analyze_symptom_image(tracker)
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Image analysis complete: {analysis['description']}. "
                           f"Confidence: {analysis['confidence']}%. "
                           f"Recommendation: {analysis['recommendation']}"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in image analysis: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't analyze the image. Please try uploading again."}]
        }

async def handle_voice_processing(request: Dict[str, Any]):
    """Handle voice message processing"""
    try:
        tracker = request.get("tracker", {})
        if VoiceProcessingService is None:
            return {"events": [], "responses": [{"text": "Voice processing service is not enabled."}]}
        voice_service = VoiceProcessingService()
        transcription = await voice_service.process_voice_message(tracker)
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"I've processed your voice message: '{transcription['text']}'. "
                           f"Let me help you with that."
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in voice processing: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't process your voice message. Please try again."}]
        }

async def handle_medicine_scan(request: Dict[str, Any]):
    """Handle medicine scanning"""
    try:
        tracker = request.get("tracker", {})
        if MedicineScanService is None:
            return {"events": [], "responses": [{"text": "Medicine scan service is not enabled."}]}
        scan_service = MedicineScanService()
        result = await scan_service.scan_medicine(tracker)
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Medicine scan result: {result['medicine_name']}. "
                           f"Dosage: {result['dosage']}. "
                           f"Expiry: {result['expiry']}. "
                           f"Side effects: {result['side_effects']}"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in medicine scan: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't scan the medicine. Please try again."}]
        }

async def handle_health_quiz(request: Dict[str, Any]):
    """Handle health quiz questions"""
    try:
        if HealthQuizService is None:
            return {"events": [], "responses": [{"text": "Health quiz service is not enabled."}]}
        quiz_service = HealthQuizService()
        question = await quiz_service.get_next_question()
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Health Quiz: {question['question']} "
                           f"Options: {', '.join(question['options'])}"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in health quiz: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't load the quiz question. Please try again."}]
        }

async def handle_appointment_booking(request: Dict[str, Any]):
    """Handle appointment booking"""
    try:
        tracker = request.get("tracker", {})
        slots = tracker.get("slots", {})
        
        location = slots.get("user_location")
        if AppointmentService is None:
            return {"events": [], "responses": [{"text": "Appointment service is not enabled."}]}
        appointment_service = AppointmentService()
        appointment = await appointment_service.book_appointment(location)
        
        return {
            "events": [],
            "responses": [
                {
                    "text": f"Your appointment has been scheduled for {appointment['date']} "
                           f"at {appointment['time']} with Dr. {appointment['doctor']} "
                           f"at {appointment['location']}. "
                           f"Confirmation ID: {appointment['confirmation_id']}"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error in appointment booking: {str(e)}")
        return {
            "events": [],
            "responses": [{"text": "I couldn't book your appointment. Please try again."}]
        }

# Government API endpoints
@app.get("/api/outbreaks")
async def get_outbreaks(location: Optional[str] = None):
    """Get outbreak information from government APIs"""
    try:
        outbreak_service = OutbreakService()
        outbreaks = await outbreak_service.get_outbreaks(location)
        return {"outbreaks": outbreaks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vaccination-schedule")
async def get_vaccination_schedule(age: int, location: Optional[str] = None):
    """Get vaccination schedule from government databases"""
    try:
        vaccination_service = VaccinationService()
        schedule = await vaccination_service.get_vaccination_schedule(age, location)
        return {"schedule": schedule}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/outbreak-alert")
async def receive_outbreak_alert(
    alert_data: Dict[str, Any],
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Receive outbreak alerts from government systems with HMAC verification"""
    try:
        # Verify HMAC signature
        if not verify_hmac_signature(alert_data, credentials.credentials):
            raise HTTPException(status_code=401, detail="Invalid HMAC signature")
        
        outbreak_service = OutbreakService()
        await outbreak_service.process_outbreak_alert(alert_data)
        
        return {"status": "alert_processed", "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
