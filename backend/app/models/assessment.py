from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Health metrics
    bmi = Column(Float)
    blood_pressure = Column(String)
    heart_rate = Column(Integer)
    cholesterol = Column(Float)
    blood_sugar = Column(Float)
    
    # Lifestyle factors
    smoking = Column(Boolean)
    alcohol_drinking = Column(Boolean)
    physical_activity = Column(Integer)  # hours per week
    sleep_time = Column(Float)  # hours per day
    
    # Health conditions
    stroke = Column(Boolean)
    diabetic = Column(Boolean)
    asthma = Column(Boolean)
    kidney_disease = Column(Boolean)
    skin_cancer = Column(Boolean)
    
    # Health status
    physical_health = Column(Integer)  # days in last 30
    mental_health = Column(Integer)  # days in last 30
    diff_walking = Column(Boolean)
    
    # General health rating
    gen_health = Column(String)  # Poor, Fair, Good, Very Good, Excellent
    
    # Risk assessment
    risk_score = Column(Float)
    risk_level = Column(String)  # Low, Medium, High
    critical_findings = Column(JSON)  # List of critical findings
    
    # Relationships
    user = relationship("User", back_populates="assessments")
    doctor_review = relationship("DoctorReview", back_populates="assessment", uselist=False)