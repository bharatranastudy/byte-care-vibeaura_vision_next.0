from .celery_app import celery_app
import os
import requests

API_URL = os.getenv("ACTIONS_API_URL", "http://actions:8000")

@celery_app.task(name="tasks.send_reminder")
def send_reminder(user_id: str, message: str) -> dict:
    return {"status": "queued", "user_id": user_id, "message": message}

@celery_app.task(name="tasks.send_outbreak_alert")
def send_outbreak_alert(location: str, disease: str) -> dict:
    return {"status": "queued", "location": location, "disease": disease}

@celery_app.task(name="tasks.credit_reward")
def credit_reward(user_id: str, tokens: int, reason: str) -> dict:
    return {"status": "queued", "user_id": user_id, "tokens": tokens, "reason": reason}













