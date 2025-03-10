from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class HealthStatus(str, Enum):
    EXCELLENT = "Excellent"
    VERY_GOOD = "Very Good"
    GOOD = "Good"
    FAIR = "Fair"
    POOR = "Poor"

class AssessmentBase(BaseModel):
    # Health Metrics
    bmi: float = Field(..., ge=0)
    blood_pressure: str
    heart_rate: int = Field(..., ge=0)
    cholesterol: float = Field(..., ge=0)
    blood_sugar: float = Field(..., ge=0)

    # Lifestyle Factors
    smoking: bool
    alcohol_drinking: bool
    physical_activity: int = Field(..., ge=0)
    sleep_time: float = Field(..., ge=0)

    # Health Conditions
    stroke: bool
    diabetic: bool
    asthma: bool
    kidney_disease: bool
    skin_cancer: bool

    # Health Status
    physical_health: int = Field(..., ge=0, le=30)
    mental_health: int = Field(..., ge=0, le=30)
    diff_walking: bool

    # General Health Rating
    gen_health: HealthStatus

class AssessmentCreate(AssessmentBase):
    patient_id: int

class AssessmentUpdate(BaseModel):
    # Health Metrics
    bmi: Optional[float] = Field(None, ge=0)
    blood_pressure: Optional[str] = None
    heart_rate: Optional[int] = Field(None, ge=0)
    cholesterol: Optional[float] = Field(None, ge=0)
    blood_sugar: Optional[float] = Field(None, ge=0)

    # Lifestyle Factors
    smoking: Optional[bool] = None
    alcohol_drinking: Optional[bool] = None
    physical_activity: Optional[int] = Field(None, ge=0)
    sleep_time: Optional[float] = Field(None, ge=0)

    # Health Conditions
    stroke: Optional[bool] = None
    diabetic: Optional[bool] = None
    asthma: Optional[bool] = None
    kidney_disease: Optional[bool] = None
    skin_cancer: Optional[bool] = None

    # Health Status
    physical_health: Optional[int] = Field(None, ge=0, le=30)
    mental_health: Optional[int] = Field(None, ge=0, le=30)
    diff_walking: Optional[bool] = None

    # General Health Rating
    gen_health: Optional[HealthStatus] = None

class AssessmentInDBBase(AssessmentBase):
    id: int
    patient_id: int
    created_at: datetime
    updated_at: datetime
    risk_score: float
    risk_level: str
    critical_findings: List[str]

    class Config:
        from_attributes = True

class Assessment(AssessmentInDBBase):
    pass

class AssessmentInDB(AssessmentInDBBase):
    pass