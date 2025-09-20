"""
Health Analysis Service for symptom analysis and emergency assessment
"""

import asyncio
from typing import List, Dict, Any, Optional
import httpx
from datetime import datetime
import logging

from config import settings
from database import get_db, SymptomReport, User

logger = logging.getLogger(__name__)

class HealthAnalysisService:
    """Service for analyzing health symptoms and providing recommendations"""
    
    def __init__(self):
        self.symptom_database = {
            "fever": {
                "severity": "moderate",
                "recommendation": "Rest, stay hydrated, monitor temperature",
                "emergency_indicators": ["high_fever", "fever_with_rash", "fever_with_neck_stiffness"]
            },
            "headache": {
                "severity": "mild",
                "recommendation": "Rest in a quiet, dark room, apply cold compress",
                "emergency_indicators": ["sudden_severe_headache", "headache_with_vision_changes"]
            },
            "cough": {
                "severity": "mild",
                "recommendation": "Stay hydrated, use throat lozenges",
                "emergency_indicators": ["cough_with_blood", "severe_shortness_of_breath"]
            },
            "chest_pain": {
                "severity": "high",
                "recommendation": "Seek immediate medical attention",
                "emergency_indicators": ["severe_chest_pain", "chest_pain_with_sweating"]
            },
            "dizziness": {
                "severity": "moderate",
                "recommendation": "Sit or lie down, avoid sudden movements",
                "emergency_indicators": ["severe_dizziness", "dizziness_with_fainting"]
            }
        }
    
    async def analyze_symptoms(
        self, 
        symptoms: List[str], 
        age: Optional[str] = None,
        gender: Optional[str] = None,
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze symptoms and provide recommendations
        
        Args:
            symptoms: List of symptoms reported by user
            age: User's age
            gender: User's gender
            location: User's location
        
        Returns:
            Dict containing analysis results
        """
        try:
            if not symptoms:
                return {
                    "severity": "unknown",
                    "recommendation": "Please describe your symptoms in detail",
                    "confidence": 0.0
                }
            
            # Analyze each symptom
            analysis_results = []
            total_severity_score = 0
            emergency_indicators = []
            
            for symptom in symptoms:
                symptom_lower = symptom.lower()
                
                # Find matching symptom in database
                matched_symptom = None
                for db_symptom, info in self.symptom_database.items():
                    if db_symptom in symptom_lower or symptom_lower in db_symptom:
                        matched_symptom = info
                        break
                
                if matched_symptom:
                    analysis_results.append({
                        "symptom": symptom,
                        "severity": matched_symptom["severity"],
                        "recommendation": matched_symptom["recommendation"]
                    })
                    
                    # Calculate severity score
                    severity_scores = {"mild": 1, "moderate": 2, "high": 3}
                    total_severity_score += severity_scores.get(matched_symptom["severity"], 1)
                    
                    # Check for emergency indicators
                    emergency_indicators.extend(matched_symptom["emergency_indicators"])
                else:
                    # Unknown symptom - moderate severity
                    analysis_results.append({
                        "symptom": symptom,
                        "severity": "moderate",
                        "recommendation": "Consult a healthcare professional for proper diagnosis"
                    })
                    total_severity_score += 2
            
            # Determine overall severity
            avg_severity_score = total_severity_score / len(symptoms)
            if avg_severity_score >= 2.5:
                overall_severity = "high"
            elif avg_severity_score >= 1.5:
                overall_severity = "moderate"
            else:
                overall_severity = "mild"
            
            # Generate overall recommendation
            recommendation = self._generate_recommendation(analysis_results, overall_severity, age, gender)
            
            # Check for emergency conditions
            is_emergency = self._check_emergency_conditions(symptoms, emergency_indicators)
            
            # Store analysis in database
            await self._store_analysis(symptoms, overall_severity, recommendation, analysis_results)
            
            return {
                "severity": overall_severity,
                "recommendation": recommendation,
                "confidence": min(0.9, len(symptoms) * 0.2),  # Higher confidence with more symptoms
                "is_emergency": is_emergency,
                "detailed_analysis": analysis_results,
                "emergency_indicators": emergency_indicators
            }
            
        except Exception as e:
            logger.error(f"Error in symptom analysis: {str(e)}")
            return {
                "severity": "unknown",
                "recommendation": "I'm sorry, I couldn't analyze your symptoms. Please consult a healthcare professional.",
                "confidence": 0.0,
                "is_emergency": False
            }
    
    def _generate_recommendation(
        self, 
        analysis_results: List[Dict], 
        severity: str, 
        age: Optional[str], 
        gender: Optional[str]
    ) -> str:
        """Generate personalized recommendation based on analysis"""
        
        base_recommendations = {
            "mild": "Monitor your symptoms and get plenty of rest. Stay hydrated and maintain a healthy diet.",
            "moderate": "Consider consulting a healthcare professional if symptoms persist or worsen. Rest and stay hydrated.",
            "high": "Please consult a healthcare professional as soon as possible. Monitor symptoms closely."
        }
        
        recommendation = base_recommendations.get(severity, base_recommendations["moderate"])
        
        # Add age-specific recommendations
        if age:
            try:
                age_int = int(age)
                if age_int < 18:
                    recommendation += " For minors, please consult with a pediatrician."
                elif age_int > 65:
                    recommendation += " For seniors, please be extra cautious and consult a healthcare professional."
            except ValueError:
                pass
        
        # Add gender-specific recommendations
        if gender and gender.lower() in ["female", "woman"]:
            recommendation += " If you're pregnant or breastfeeding, please consult your doctor immediately."
        
        return recommendation
    
    def _check_emergency_conditions(self, symptoms: List[str], emergency_indicators: List[str]) -> bool:
        """Check if symptoms indicate an emergency situation"""
        
        emergency_keywords = [
            "severe", "intense", "unbearable", "can't breathe", "difficulty breathing",
            "chest pain", "heart attack", "stroke", "unconscious", "fainting",
            "severe bleeding", "severe injury", "poisoning", "overdose"
        ]
        
        symptoms_text = " ".join(symptoms).lower()
        
        # Check for emergency keywords
        for keyword in emergency_keywords:
            if keyword in symptoms_text:
                return True
        
        # Check for emergency indicators from symptom database
        for indicator in emergency_indicators:
            if indicator.replace("_", " ") in symptoms_text:
                return True
        
        return False
    
    async def assess_emergency(self, symptoms: List[str]) -> Dict[str, Any]:
        """Assess if symptoms indicate an emergency"""
        
        analysis = await self.analyze_symptoms(symptoms)
        
        if analysis["is_emergency"]:
            return {
                "is_emergency": True,
                "message": "Your symptoms indicate a potential emergency situation.",
                "immediate_actions": [
                    "Call emergency services (108) immediately",
                    "Do not delay seeking medical help",
                    "Stay calm and follow emergency operator instructions"
                ]
            }
        else:
            return {
                "is_emergency": False,
                "message": "Your symptoms do not appear to indicate an emergency.",
                "recommendations": analysis["recommendation"]
            }
    
    async def get_health_tips(self) -> Dict[str, Any]:
        """Get general health tips"""
        
        tips = [
            "Stay hydrated by drinking at least 8 glasses of water daily",
            "Get 7-9 hours of quality sleep each night",
            "Exercise for at least 30 minutes most days of the week",
            "Eat a balanced diet with plenty of fruits and vegetables",
            "Wash your hands frequently with soap and water",
            "Practice stress management techniques like meditation or deep breathing",
            "Avoid smoking and limit alcohol consumption",
            "Get regular health check-ups and screenings",
            "Maintain good hygiene and personal care",
            "Stay up-to-date with vaccinations"
        ]
        
        return {
            "tips": tips,
            "source": "WHO and CDC guidelines",
            "last_updated": datetime.utcnow().isoformat()
        }
    
    async def _store_analysis(
        self, 
        symptoms: List[str], 
        severity: str, 
        recommendation: str, 
        detailed_analysis: List[Dict]
    ):
        """Store analysis results in database"""
        try:
            db = next(get_db())
            
            symptom_report = SymptomReport(
                symptoms=symptoms,
                severity=severity,
                analysis_result=recommendation,
                recommendation=recommendation
            )
            
            db.add(symptom_report)
            db.commit()
            
        except Exception as e:
            logger.error(f"Error storing analysis: {str(e)}")
            db.rollback()
        finally:
            db.close()
