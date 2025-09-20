"""
Outbreak Service for government API integration and real-time alerts
"""

import asyncio
from typing import Dict, Any, Optional, List
import httpx
from datetime import datetime, timedelta
import logging

from config import settings
from database import get_db, OutbreakAlert
from auth import generate_hmac_signature

logger = logging.getLogger(__name__)

class OutbreakService:
    """Service for outbreak monitoring and government database integration"""
    
    def __init__(self):
        self.outbreak_sources = {
            "mofhw": settings.mofhw_base_url,
            "idsp": settings.idsp_base_url
        }
    
    async def check_outbreaks(self, location: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Check for active outbreaks in the specified location
        
        Args:
            location: Location to check for outbreaks
        
        Returns:
            List of active outbreaks
        """
        try:
            outbreaks = []
            
            # Check MOFHW database
            mofhw_outbreaks = await self._check_mofhw_outbreaks(location)
            outbreaks.extend(mofhw_outbreaks)
            
            # Check IDSP database
            idsp_outbreaks = await self._check_idsp_outbreaks(location)
            outbreaks.extend(idsp_outbreaks)
            
            # Check local database for recent alerts
            local_outbreaks = await self._check_local_outbreaks(location)
            outbreaks.extend(local_outbreaks)
            
            # Remove duplicates and sort by severity
            unique_outbreaks = self._deduplicate_outbreaks(outbreaks)
            unique_outbreaks.sort(key=lambda x: self._get_severity_score(x["severity_level"]), reverse=True)
            
            return unique_outbreaks
            
        except Exception as e:
            logger.error(f"Error checking outbreaks: {str(e)}")
            return []
    
    async def _check_mofhw_outbreaks(self, location: Optional[str]) -> List[Dict[str, Any]]:
        """Check MOFHW database for outbreaks"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.mofhw_base_url}/outbreaks"
                headers = {
                    "Authorization": f"Bearer {settings.mofhw_api_key}",
                    "Content-Type": "application/json"
                }
                params = {"location": location} if location else {}
                
                response = await client.get(url, headers=headers, params=params, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_mofhw_data(data)
                
        except Exception as e:
            logger.error(f"Error checking MOFHW outbreaks: {str(e)}")
        
        return []
    
    async def _check_idsp_outbreaks(self, location: Optional[str]) -> List[Dict[str, Any]]:
        """Check IDSP database for outbreaks"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.idsp_base_url}/outbreaks"
                headers = {
                    "Authorization": f"Bearer {settings.idsp_api_key}",
                    "Content-Type": "application/json"
                }
                params = {"location": location} if location else {}
                
                response = await client.get(url, headers=headers, params=params, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_idsp_data(data)
                
        except Exception as e:
            logger.error(f"Error checking IDSP outbreaks: {str(e)}")
        
        return []
    
    async def _check_local_outbreaks(self, location: Optional[str]) -> List[Dict[str, Any]]:
        """Check local database for recent outbreak alerts"""
        try:
            db = next(get_db())
            
            query = db.query(OutbreakAlert).filter(
                OutbreakAlert.verified == True,
                OutbreakAlert.created_at >= datetime.utcnow() - timedelta(days=30)
            )
            
            if location:
                query = query.filter(OutbreakAlert.location.ilike(f"%{location}%"))
            
            alerts = query.all()
            
            return [
                {
                    "disease": alert.disease_name,
                    "location": alert.location,
                    "cases": alert.cases_count,
                    "severity_level": alert.severity_level,
                    "alert_message": alert.alert_message,
                    "precautions": alert.precautions,
                    "source": alert.source,
                    "created_at": alert.created_at.isoformat()
                }
                for alert in alerts
            ]
            
        except Exception as e:
            logger.error(f"Error checking local outbreaks: {str(e)}")
            return []
        finally:
            db.close()
    
    def _parse_mofhw_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse MOFHW API response"""
        outbreaks = []
        
        if "outbreaks" in data:
            for outbreak in data["outbreaks"]:
                outbreaks.append({
                    "disease": outbreak.get("disease_name", "Unknown"),
                    "location": outbreak.get("location", "Unknown"),
                    "cases": outbreak.get("cases_count", 0),
                    "severity_level": outbreak.get("severity", "moderate"),
                    "alert_message": outbreak.get("alert_message", ""),
                    "precautions": outbreak.get("precautions", []),
                    "source": "MOFHW",
                    "created_at": outbreak.get("created_at", datetime.utcnow().isoformat())
                })
        
        return outbreaks
    
    def _parse_idsp_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse IDSP API response"""
        outbreaks = []
        
        if "alerts" in data:
            for alert in data["alerts"]:
                outbreaks.append({
                    "disease": alert.get("disease", "Unknown"),
                    "location": alert.get("district", "Unknown"),
                    "cases": alert.get("case_count", 0),
                    "severity_level": alert.get("risk_level", "moderate"),
                    "alert_message": alert.get("message", ""),
                    "precautions": alert.get("prevention_measures", []),
                    "source": "IDSP",
                    "created_at": alert.get("timestamp", datetime.utcnow().isoformat())
                })
        
        return outbreaks
    
    def _deduplicate_outbreaks(self, outbreaks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate outbreaks based on disease and location"""
        seen = set()
        unique_outbreaks = []
        
        for outbreak in outbreaks:
            key = (outbreak["disease"], outbreak["location"])
            if key not in seen:
                seen.add(key)
                unique_outbreaks.append(outbreak)
        
        return unique_outbreaks
    
    def _get_severity_score(self, severity: str) -> int:
        """Get numeric score for severity level"""
        severity_scores = {
            "low": 1,
            "moderate": 2,
            "high": 3,
            "critical": 4
        }
        return severity_scores.get(severity.lower(), 2)
    
    async def process_outbreak_alert(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming outbreak alert from government systems"""
        try:
            db = next(get_db())
            
            # Create outbreak alert record
            outbreak_alert = OutbreakAlert(
                disease_name=alert_data.get("disease_name", "Unknown"),
                location=alert_data.get("location", "Unknown"),
                cases_count=alert_data.get("cases_count", 0),
                severity_level=alert_data.get("severity_level", "moderate"),
                alert_message=alert_data.get("alert_message", ""),
                precautions=alert_data.get("precautions", []),
                source=alert_data.get("source", "Government"),
                verified=True
            )
            
            db.add(outbreak_alert)
            db.commit()
            
            # Trigger notifications to users in affected area
            await self._notify_users_in_area(outbreak_alert.location, outbreak_alert)
            
            return {
                "success": True,
                "alert_id": str(outbreak_alert.id),
                "message": "Outbreak alert processed successfully"
            }
            
        except Exception as e:
            logger.error(f"Error processing outbreak alert: {str(e)}")
            db.rollback()
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            db.close()
    
    async def _notify_users_in_area(self, location: str, alert: OutbreakAlert):
        """Notify users in the affected area about the outbreak"""
        try:
            # This would integrate with notification services
            # For now, we'll just log the notification
            logger.info(f"Notifying users in {location} about {alert.disease_name} outbreak")
            
            # In a real implementation, this would:
            # 1. Query users in the affected area
            # 2. Send WhatsApp/SMS notifications
            # 3. Update user dashboards
            # 4. Trigger push notifications
            
        except Exception as e:
            logger.error(f"Error notifying users: {str(e)}")
    
    async def get_outbreak_statistics(self, days: int = 30) -> Dict[str, Any]:
        """Get outbreak statistics for the specified period"""
        try:
            db = next(get_db())
            
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get outbreak counts by disease
            disease_counts = db.query(
                OutbreakAlert.disease_name,
                db.func.count(OutbreakAlert.id)
            ).filter(
                OutbreakAlert.created_at >= start_date,
                OutbreakAlert.verified == True
            ).group_by(OutbreakAlert.disease_name).all()
            
            # Get outbreak counts by location
            location_counts = db.query(
                OutbreakAlert.location,
                db.func.count(OutbreakAlert.id)
            ).filter(
                OutbreakAlert.created_at >= start_date,
                OutbreakAlert.verified == True
            ).group_by(OutbreakAlert.location).all()
            
            # Get severity distribution
            severity_counts = db.query(
                OutbreakAlert.severity_level,
                db.func.count(OutbreakAlert.id)
            ).filter(
                OutbreakAlert.created_at >= start_date,
                OutbreakAlert.verified == True
            ).group_by(OutbreakAlert.severity_level).all()
            
            return {
                "period_days": days,
                "total_outbreaks": sum(count for _, count in disease_counts),
                "disease_distribution": dict(disease_counts),
                "location_distribution": dict(location_counts),
                "severity_distribution": dict(severity_counts),
                "generated_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting outbreak statistics: {str(e)}")
            return {
                "period_days": days,
                "total_outbreaks": 0,
                "disease_distribution": {},
                "location_distribution": {},
                "severity_distribution": {},
                "error": str(e)
            }
        finally:
            db.close()
