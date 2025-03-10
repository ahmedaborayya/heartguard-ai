from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class HealthMetricsBase(BaseModel):
    bmi: float = Field(..., description="Body Mass Index")
    smoking: bool = Field(..., description="Whether the patient smokes")
    alcohol_drinking: bool = Field(..., description="Whether the patient drinks alcohol")
    stroke: bool = Field(..., description="Whether the patient had a stroke")
    physical_health: int = Field(..., ge=0, le=30, description="Physical health rating (0-30 days)")
    mental_health: int = Field(..., ge=0, le=30, description="Mental health rating (0-30 days)")
    diff_walking: bool = Field(..., description="Whether the patient has difficulty walking")
    sex: str = Field(..., description="Patient's biological sex")
    age_category: str = Field(..., description="Age category of the patient")
    race: str = Field(..., description="Patient's race/ethnicity")
    diabetic: bool = Field(..., description="Whether the patient is diabetic")
    physical_activity: bool = Field(..., description="Whether the patient is physically active")
    gen_health: str = Field(..., description="General health condition")
    sleep_time: float = Field(..., ge=0, le=24, description="Average sleep time in hours")
    asthma: bool = Field(..., description="Whether the patient has asthma")
    kidney_disease: bool = Field(..., description="Whether the patient has kidney disease")
    skin_cancer: bool = Field(..., description="Whether the patient has skin cancer")

class PredictionCreate(HealthMetricsBase):
    pass

class DoctorReviewBase(BaseModel):
    notes: str
    recommendations: List[str]
    prescribed_medications: Optional[List[str]] = None
    follow_up_date: Optional[datetime] = None
    status: str = "pending"
    risk_level: str
    action_items: List[str]

class DoctorReviewCreate(DoctorReviewBase):
    pass

class DoctorReviewUpdate(DoctorReviewBase):
    pass

class DoctorReviewInDBBase(DoctorReviewBase):
    id: str
    prediction_id: str
    doctor_id: str
    review_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DoctorReview(DoctorReviewInDBBase):
    pass

class PredictionInDBBase(HealthMetricsBase):
    id: str
    user_id: str
    prediction_result: bool
    prediction_date: datetime
    reviewed_at: Optional[datetime] = None
    next_assessment_date: Optional[datetime] = None
    critical_findings: Optional[List[str]] = None
    lifestyle_recommendations: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Prediction(PredictionInDBBase):
    doctor_review: Optional[DoctorReview] = None

class PredictionResponse(BaseModel):
    prediction: Prediction
    risk_factors: List[dict]
    recommendations: List[str]

class PredictionBase(BaseModel):
    bmi: float
    smoking: bool
    alcohol_drinking: bool
    stroke: bool
    physical_health: int
    mental_health: int
    diff_walking: bool
    sex: str
    age_category: str
    race: str
    diabetic: bool
    physical_activity: bool
    gen_health: str
    sleep_time: float
    asthma: bool
    kidney_disease: bool
    skin_cancer: bool

class PredictionResponse(PredictionBase):
    id: int
    user_id: int
    risk_score: float
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True