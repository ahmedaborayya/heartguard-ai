from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class ReviewStatus(str, Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    FOLLOW_UP = "follow_up"
    CLOSED = "closed"

class DoctorReviewBase(BaseModel):
    notes: str
    recommendations: str
    follow_up_date: Optional[datetime] = None
    status: ReviewStatus = ReviewStatus.PENDING

class DoctorReviewCreate(DoctorReviewBase):
    assessment_id: int
    doctor_id: int

class DoctorReviewUpdate(BaseModel):
    notes: Optional[str] = None
    recommendations: Optional[str] = None
    follow_up_date: Optional[datetime] = None
    status: Optional[ReviewStatus] = None

class DoctorReviewInDBBase(DoctorReviewBase):
    id: int
    assessment_id: int
    doctor_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DoctorReview(DoctorReviewInDBBase):
    pass

class DoctorReviewInDB(DoctorReviewInDBBase):
    pass