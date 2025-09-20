CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) UNIQUE,
  language_preference VARCHAR(10) DEFAULT 'en',
  age INT,
  gender VARCHAR(10),
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS symptom_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  symptoms JSONB,
  severity VARCHAR(20),
  analysis_result TEXT,
  recommendation TEXT,
  image_url VARCHAR(500),
  voice_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vaccination_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  vaccine_name VARCHAR(100),
  vaccine_type VARCHAR(50),
  date_administered TIMESTAMP,
  next_due_date TIMESTAMP,
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action_type VARCHAR(50),
  tokens_earned INT,
  transaction_hash VARCHAR(66),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS outbreak_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disease_name VARCHAR(100),
  location VARCHAR(100),
  cases_count INT,
  severity_level VARCHAR(20),
  alert_message TEXT,
  precautions JSONB,
  source VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicine_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_name VARCHAR(200),
  generic_name VARCHAR(200),
  dosage_form VARCHAR(50),
  dosage_strength VARCHAR(100),
  side_effects JSONB,
  contraindications JSONB,
  interactions JSONB,
  manufacturer VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT,
  options JSONB,
  correct_answer VARCHAR(10),
  category VARCHAR(50),
  difficulty_level VARCHAR(20),
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  doctor_name VARCHAR(100),
  hospital_name VARCHAR(200),
  appointment_date TIMESTAMP,
  appointment_time VARCHAR(10),
  location VARCHAR(200),
  status VARCHAR(20) DEFAULT 'scheduled',
  confirmation_id VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);













