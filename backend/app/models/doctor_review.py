from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

class DoctorReview(Base):
    __tablename__ = "doctor_reviews"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Review content
    notes = Column(Text)
    recommendations = Column(Text)
    follow_up_date = Column(DateTime(timezone=True))
    status = Column(String)  # Pending, Reviewed, Needs Revision
    
    # Relationships
    assessment = relationship("Assessment", back_populates="doctor_review")
    doctor = relationship("User", back_populates="doctor_reviews")