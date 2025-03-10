from typing import List, Optional
from sqlalchemy.orm import Session
import uuid
from datetime import datetime
from ..models.models import Prediction, DoctorReview
from ..schemas.prediction import PredictionCreate, DoctorReviewCreate, PredictionResponse
from app.models.assessment import Assessment
from app.services.ml_service import ml_service

def create_prediction(
    db: Session,
    *,
    user_id: int,
    prediction_in: PredictionCreate,
) -> PredictionResponse:
    """
    Create a new prediction.
    """
    # Make prediction using ML model
    prediction_result = ml_service.predict(prediction_in.features)
    
    # Create assessment record
    db_assessment = Assessment(
        user_id=user_id,
        **prediction_in.dict(),
        risk_score=prediction_result,
        risk_level="HIGH" if prediction_result > 0.5 else "LOW",
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    
    return PredictionResponse(
        id=db_assessment.id,
        user_id=db_assessment.user_id,
        risk_score=db_assessment.risk_score,
        risk_level=db_assessment.risk_level,
        created_at=db_assessment.created_at,
    )

def get_prediction(db: Session, prediction_id: str) -> Optional[Prediction]:
    return db.query(Prediction).filter(Prediction.id == prediction_id).first()

def get_user_predictions(
    db: Session,
    *,
    user_id: int,
) -> List[PredictionResponse]:
    """
    Get all predictions for a user.
    """
    assessments = db.query(Assessment).filter(Assessment.user_id == user_id).all()
    return [
        PredictionResponse(
            id=assessment.id,
            user_id=assessment.user_id,
            risk_score=assessment.risk_score,
            risk_level=assessment.risk_level,
            created_at=assessment.created_at,
        )
        for assessment in assessments
    ]

def create_doctor_review(
    db: Session,
    *,
    prediction_id: str,
    doctor_id: str,
    obj_in: DoctorReviewCreate
) -> DoctorReview:
    review_data = obj_in.model_dump()
    db_obj = DoctorReview(
        id=str(uuid.uuid4()),
        prediction_id=prediction_id,
        doctor_id=doctor_id,
        **review_data
    )
    
    # Update the prediction's review status
    prediction = get_prediction(db, prediction_id)
    if prediction:
        prediction.reviewed_at = datetime.utcnow()
        prediction.next_assessment_date = obj_in.follow_up_date
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_doctor_review(
    db: Session, prediction_id: str
) -> Optional[DoctorReview]:
    return (
        db.query(DoctorReview)
        .filter(DoctorReview.prediction_id == prediction_id)
        .first()
    )

def get_doctor_reviews(
    db: Session, doctor_id: str, skip: int = 0, limit: int = 100
) -> List[DoctorReview]:
    return (
        db.query(DoctorReview)
        .filter(DoctorReview.doctor_id == doctor_id)
        .order_by(DoctorReview.review_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_doctor_review(
    db: Session,
    *,
    db_obj: DoctorReview,
    obj_in: DoctorReviewCreate
) -> DoctorReview:
    update_data = obj_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    # Update the prediction's next assessment date if provided
    if update_data.get("follow_up_date"):
        prediction = get_prediction(db, db_obj.prediction_id)
        if prediction:
            prediction.next_assessment_date = update_data["follow_up_date"]
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj