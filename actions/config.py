"""
Configuration settings for SIH Health Bot
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database settings
    database_url: str = "postgresql://postgres:postgres@localhost:5432/sih_health_bot"
    redis_url: str = "redis://localhost:6379"
    
    # API Keys
    mofhw_api_key: Optional[str] = None
    idsp_api_key: Optional[str] = None
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    gupshup_api_key: Optional[str] = None
    
    # Blockchain settings
    ethereum_rpc_url: str = "http://localhost:8545"
    contract_address: Optional[str] = None
    private_key: Optional[str] = None
    
    # ML Model settings
    whisper_model_path: str = "/app/models/whisper"
    tesseract_model_path: str = "/app/models/tesseract"
    outbreak_model_path: str = "/app/models/outbreak"
    
    # Security settings
    hmac_secret_key: str = "your-hmac-secret-key"
    jwt_secret_key: str = "your-jwt-secret-key"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    # Government API endpoints
    mofhw_base_url: str = "https://api.mohfw.gov.in"
    idsp_base_url: str = "https://api.idsp.gov.in"
    
    # Reward system settings
    reward_per_symptom_report: int = 10
    reward_per_vaccination_check: int = 25
    reward_per_health_quiz: int = 15
    reward_per_medicine_scan: int = 5
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
