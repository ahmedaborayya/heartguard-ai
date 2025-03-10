from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..db.base_class import Base

class UserRole(str, enum.Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(Enum(UserRole))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    predictions = relationship("Prediction", back_populates="user")
    doctor_reviews = relationship("DoctorReview", back_populates="doctor")
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    date_of_birth = Column(DateTime)
    gender = Column(String)
    height = Column(Float)
    weight = Column(Float)
    blood_type = Column(String)
    medical_history = Column(JSON)
    emergency_contact = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="patient_profile")

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    specialization = Column(String)
    license_number = Column(String)
    education = Column(JSON)
    experience_years = Column(Integer)
    availability = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="doctor_profile")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    prediction_result = Column(Boolean)
    prediction_date = Column(DateTime, default=datetime.utcnow)
    
    # Health metrics
    bmi = Column(Float)
    smoking = Column(Boolean)
    alcohol_drinking = Column(Boolean)
    stroke = Column(Boolean)
    physical_health = Column(Integer)
    mental_health = Column(Integer)
    diff_walking = Column(Boolean)
    sex = Column(String)
    age_category = Column(String)
    race = Column(String)
    diabetic = Column(Boolean)
    physical_activity = Column(Boolean)
    gen_health = Column(String)
    sleep_time = Column(Float)
    asthma = Column(Boolean)
    kidney_disease = Column(Boolean)
    skin_cancer = Column(Boolean)

    # Review tracking
    reviewed_at = Column(DateTime)
    next_assessment_date = Column(DateTime)
    critical_findings = Column(JSON)
    lifestyle_recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="predictions")
    doctor_review = relationship("DoctorReview", back_populates="prediction", uselist=False)

class DoctorReview(Base):
    __tablename__ = "doctor_reviews"

    id = Column(String, primary_key=True, index=True)
    prediction_id = Column(String, ForeignKey("predictions.id"))
    doctor_id = Column(String, ForeignKey("users.id"))
    review_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(String)
    recommendations = Column(JSON)
    prescribed_medications = Column(JSON)
    follow_up_date = Column(DateTime)
    status = Column(String)  # pending, reviewed, needs_followup
    risk_level = Column(String)  # low, medium, high
    action_items = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    prediction = relationship("Prediction", back_populates="doctor_review")
    doctor = relationship("User", back_populates="doctor_reviews")