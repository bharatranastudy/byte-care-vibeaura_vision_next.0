"""
Vaccination Service for managing vaccination schedules and government integration
"""

import asyncio
from typing import Dict, Any, Optional, List
import httpx
from datetime import datetime, timedelta
import logging

from config import settings
from database import get_db, VaccinationRecord, User

logger = logging.getLogger(__name__)

class VaccinationService:
    """Service for vaccination schedule management and government database integration"""
    
    def __init__(self):
        self.vaccination_schedules = {
            "infant": {
                "age_range": "0-12 months",
                "vaccines": [
                    {"name": "BCG", "age": "At birth", "disease": "Tuberculosis"},
                    {"name": "Hepatitis B", "age": "At birth", "disease": "Hepatitis B"},
                    {"name": "OPV", "age": "6, 10, 14 weeks", "disease": "Polio"},
                    {"name": "DPT", "age": "6, 10, 14 weeks", "disease": "Diphtheria, Pertussis, Tetanus"},
                    {"name": "Hib", "age": "6, 10, 14 weeks", "disease": "Haemophilus influenzae type b"},
                    {"name": "PCV", "age": "6, 10, 14 weeks", "disease": "Pneumococcal disease"},
                    {"name": "Rotavirus", "age": "6, 10, 14 weeks", "disease": "Rotavirus gastroenteritis"},
                    {"name": "Measles", "age": "9 months", "disease": "Measles"},
                    {"name": "JE", "age": "9-12 months", "disease": "Japanese Encephalitis"}
                ]
            },
            "child": {
                "age_range": "1-18 years",
                "vaccines": [
                    {"name": "MMR", "age": "15-18 months", "disease": "Measles, Mumps, Rubella"},
                    {"name": "DPT Booster", "age": "16-18 months", "disease": "Diphtheria, Pertussis, Tetanus"},
                    {"name": "OPV Booster", "age": "16-18 months", "disease": "Polio"},
                    {"name": "Hepatitis A", "age": "12-18 months", "disease": "Hepatitis A"},
                    {"name": "Typhoid", "age": "2 years", "disease": "Typhoid fever"},
                    {"name": "Varicella", "age": "12-15 months", "disease": "Chickenpox"},
                    {"name": "HPV", "age": "9-14 years (girls)", "disease": "Human Papillomavirus"},
                    {"name": "Tdap", "age": "11-12 years", "disease": "Tetanus, Diphtheria, Pertussis"}
                ]
            },
            "adult": {
                "age_range": "18+ years",
                "vaccines": [
                    {"name": "COVID-19", "age": "18+ years", "disease": "COVID-19"},
                    {"name": "Influenza", "age": "Annually", "disease": "Seasonal flu"},
                    {"name": "Tdap", "age": "Every 10 years", "disease": "Tetanus, Diphtheria, Pertussis"},
                    {"name": "Hepatitis B", "age": "If not vaccinated", "disease": "Hepatitis B"},
                    {"name": "MMR", "age": "If not vaccinated", "disease": "Measles, Mumps, Rubella"},
                    {"name": "Varicella", "age": "If not vaccinated", "disease": "Chickenpox"},
                    {"name": "HPV", "age": "Up to 26 years", "disease": "Human Papillomavirus"},
                    {"name": "Pneumococcal", "age": "65+ years", "disease": "Pneumococcal disease"},
                    {"name": "Shingles", "age": "50+ years", "disease": "Herpes Zoster"}
                ]
            },
            "senior": {
                "age_range": "65+ years",
                "vaccines": [
                    {"name": "Pneumococcal", "age": "65+ years", "disease": "Pneumococcal disease"},
                    {"name": "Influenza", "age": "Annually", "disease": "Seasonal flu"},
                    {"name": "Tdap", "age": "Every 10 years", "disease": "Tetanus, Diphtheria, Pertussis"},
                    {"name": "Shingles", "age": "50+ years", "disease": "Herpes Zoster"},
                    {"name": "COVID-19", "age": "As recommended", "disease": "COVID-19"}
                ]
            }
        }
    
    async def get_vaccination_schedule(
        self, 
        age: Optional[str] = None, 
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get vaccination schedule based on age and location
        
        Args:
            age: User's age
            location: User's location
        
        Returns:
            Dict containing vaccination schedule
        """
        try:
            # Determine age group
            age_group = self._determine_age_group(age)
            
            # Get base schedule
            schedule = self.vaccination_schedules.get(age_group, self.vaccination_schedules["adult"])
            
            # Enhance with government data if available
            if location:
                gov_schedule = await self._get_government_schedule(location, age_group)
                if gov_schedule:
                    schedule = self._merge_schedules(schedule, gov_schedule)
            
            # Get next recommended vaccine
            next_vaccine = self._get_next_vaccine(schedule, age)
            
            return {
                "age_group": age_group,
                "schedule": schedule,
                "next_vaccine": next_vaccine,
                "location_specific": location is not None,
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting vaccination schedule: {str(e)}")
            return {
                "age_group": "adult",
                "schedule": self.vaccination_schedules["adult"],
                "next_vaccine": "COVID-19 vaccine",
                "location_specific": False,
                "error": str(e)
            }
    
    def _determine_age_group(self, age: Optional[str]) -> str:
        """Determine age group based on age"""
        if not age:
            return "adult"
        
        try:
            age_int = int(age)
            if age_int < 1:
                return "infant"
            elif age_int < 18:
                return "child"
            elif age_int < 65:
                return "adult"
            else:
                return "senior"
        except ValueError:
            return "adult"
    
    async def _get_government_schedule(self, location: str, age_group: str) -> Optional[Dict]:
        """Get vaccination schedule from government APIs"""
        try:
            async with httpx.AsyncClient() as client:
                # Try MOFHW API first
                mofhw_url = f"{settings.mofhw_base_url}/vaccination/schedule"
                headers = {"Authorization": f"Bearer {settings.mofhw_api_key}"}
                params = {"location": location, "age_group": age_group}
                
                response = await client.get(mofhw_url, headers=headers, params=params)
                
                if response.status_code == 200:
                    return response.json()
                
                # Fallback to IDSP API
                idsp_url = f"{settings.idsp_base_url}/vaccination/schedule"
                headers = {"Authorization": f"Bearer {settings.idsp_api_key}"}
                
                response = await client.get(idsp_url, headers=headers, params=params)
                
                if response.status_code == 200:
                    return response.json()
                
        except Exception as e:
            logger.error(f"Error fetching government schedule: {str(e)}")
        
        return None
    
    def _merge_schedules(self, base_schedule: Dict, gov_schedule: Dict) -> Dict:
        """Merge base schedule with government data"""
        # Add government-specific vaccines
        if "additional_vaccines" in gov_schedule:
            base_schedule["vaccines"].extend(gov_schedule["additional_vaccines"])
        
        # Update recommendations
        if "recommendations" in gov_schedule:
            base_schedule["recommendations"] = gov_schedule["recommendations"]
        
        return base_schedule
    
    def _get_next_vaccine(self, schedule: Dict, age: Optional[str]) -> Dict[str, Any]:
        """Get next recommended vaccine"""
        vaccines = schedule.get("vaccines", [])
        
        if not vaccines:
            return {"name": "COVID-19", "reason": "General recommendation"}
        
        # Simple logic to determine next vaccine
        # In a real implementation, this would consider user's vaccination history
        for vaccine in vaccines:
            if vaccine["name"] == "COVID-19":
                return {
                    "name": vaccine["name"],
                    "age": vaccine["age"],
                    "disease": vaccine["disease"],
                    "reason": "High priority due to ongoing pandemic"
                }
        
        # Return first vaccine if COVID-19 not found
        first_vaccine = vaccines[0]
        return {
            "name": first_vaccine["name"],
            "age": first_vaccine["age"],
            "disease": first_vaccine["disease"],
            "reason": "Next in schedule"
        }
    
    async def record_vaccination(
        self, 
        user_id: str, 
        vaccine_name: str, 
        date_administered: datetime,
        location: str
    ) -> Dict[str, Any]:
        """Record a vaccination in the database"""
        try:
            db = next(get_db())
            
            vaccination_record = VaccinationRecord(
                user_id=user_id,
                vaccine_name=vaccine_name,
                date_administered=date_administered,
                location=location
            )
            
            db.add(vaccination_record)
            db.commit()
            
            return {
                "success": True,
                "record_id": str(vaccination_record.id),
                "message": f"Vaccination {vaccine_name} recorded successfully"
            }
            
        except Exception as e:
            logger.error(f"Error recording vaccination: {str(e)}")
            db.rollback()
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            db.close()
    
    async def get_vaccination_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's vaccination history"""
        try:
            db = next(get_db())
            
            records = db.query(VaccinationRecord).filter(
                VaccinationRecord.user_id == user_id
            ).order_by(VaccinationRecord.date_administered.desc()).all()
            
            return [
                {
                    "vaccine_name": record.vaccine_name,
                    "date_administered": record.date_administered.isoformat(),
                    "location": record.location
                }
                for record in records
            ]
            
        except Exception as e:
            logger.error(f"Error getting vaccination history: {str(e)}")
            return []
        finally:
            db.close()
    
    async def check_vaccination_status(self, user_id: str, age: str) -> Dict[str, Any]:
        """Check user's vaccination status against recommended schedule"""
        try:
            # Get recommended schedule
            schedule = await self.get_vaccination_schedule(age)
            
            # Get user's vaccination history
            history = await self.get_vaccination_history(user_id)
            
            # Check which vaccines are missing
            recommended_vaccines = [v["name"] for v in schedule["schedule"]["vaccines"]]
            administered_vaccines = [h["vaccine_name"] for h in history]
            
            missing_vaccines = [
                v for v in recommended_vaccines 
                if v not in administered_vaccines
            ]
            
            return {
                "up_to_date": len(missing_vaccines) == 0,
                "missing_vaccines": missing_vaccines,
                "next_recommended": missing_vaccines[0] if missing_vaccines else None,
                "completion_percentage": (len(administered_vaccines) / len(recommended_vaccines)) * 100
            }
            
        except Exception as e:
            logger.error(f"Error checking vaccination status: {str(e)}")
            return {
                "up_to_date": False,
                "missing_vaccines": [],
                "next_recommended": "COVID-19",
                "completion_percentage": 0
            }
