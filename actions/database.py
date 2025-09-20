"""
Database configuration and models for SIH Health Bot
"""

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from typing import Generator

from config import settings

# Database setup
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number = Column(String(15), unique=True, index=True)
    language_preference = Column(String(10), default="en")
    age = Column(Integer)
    gender = Column(String(10))
    location = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class SymptomReport(Base):
    __tablename__ = "symptom_reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), index=True)
    symptoms = Column(JSON)
    severity = Column(String(20))
    analysis_result = Column(Text)
    recommendation = Column(Text)
    image_url = Column(String(500))
    voice_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

class VaccinationRecord(Base):
    __tablename__ = "vaccination_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), index=True)
    vaccine_name = Column(String(100))
    vaccine_type = Column(String(50))
    date_administered = Column(DateTime)
    next_due_date = Column(DateTime)
    location = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class RewardTransaction(Base):
    __tablename__ = "reward_transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), index=True)
    action_type = Column(String(50))
    tokens_earned = Column(Integer)
    transaction_hash = Column(String(66))  # Blockchain transaction hash
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class OutbreakAlert(Base):
    __tablename__ = "outbreak_alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    disease_name = Column(String(100))
    location = Column(String(100))
    cases_count = Column(Integer)
    severity_level = Column(String(20))
    alert_message = Column(Text)
    precautions = Column(JSON)
    source = Column(String(50))  # MOFHW, IDSP, etc.
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class MedicineInfo(Base):
    __tablename__ = "medicine_info"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    medicine_name = Column(String(200), index=True)
    generic_name = Column(String(200))
    dosage_form = Column(String(50))
    dosage_strength = Column(String(100))
    side_effects = Column(JSON)
    contraindications = Column(JSON)
    interactions = Column(JSON)
    manufacturer = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class HealthQuiz(Base):
    __tablename__ = "health_quizzes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question = Column(Text)
    options = Column(JSON)
    correct_answer = Column(String(10))
    category = Column(String(50))
    difficulty_level = Column(String(20))
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), index=True)
    doctor_name = Column(String(100))
    hospital_name = Column(String(200))
    appointment_date = Column(DateTime)
    appointment_time = Column(String(10))
    location = Column(String(200))
    status = Column(String(20), default="scheduled")
    confirmation_id = Column(String(50), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Database dependency
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
        
    finally:
        db.close()

# Initialize database
async def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
