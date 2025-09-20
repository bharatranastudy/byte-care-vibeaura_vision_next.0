from celery import shared_task
from .health_analysis import HealthAnalysisService
import asyncio
from typing import List, Optional


@shared_task(name="services.analyze_symptoms_task")
def analyze_symptoms_task(symptoms: List[str], age: Optional[str] = None, gender: Optional[str] = None, location: Optional[str] = None):
    """
    Thin Celery task wrapper that delegates to HealthAnalysisService.
    Celery autodiscovery will find this module because it's named tasks.py
    inside the 'services' package.
    """
    service = HealthAnalysisService()
    # health analysis functions are async; run in a fresh event loop
    return asyncio.run(service.analyze_symptoms(symptoms, age=age, gender=gender, location=location))
