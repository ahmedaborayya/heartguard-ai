from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....services import prediction_service, ml_service
from ....schemas import prediction as prediction_schemas
from ....core import deps
from ....models.models import User

router = APIRouter()

@router.post("/predict", response_model=prediction_schemas.PredictionResponse)
def predict(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
    prediction_in: prediction_schemas.PredictionCreate,
) -> Any:
    """
    Make a heart disease prediction.
    """
    if not ml_service.is_ready():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model is not available",
        )
    
    try:
        prediction = prediction_service.create_prediction(
            db=db,
            user_id=current_user.id,
            prediction_in=prediction_in,
        )
        return prediction
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error making prediction: {str(e)}",
        )

@router.get("/history", response_model=List[prediction_schemas.PredictionResponse])
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get user's prediction history.
    """
    return prediction_service.get_user_predictions(db, user_id=current_user.id)

@router.get("/me", response_model=List[prediction_schemas.Prediction])
def read_user_predictions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get all predictions for current user.
    """
    predictions = prediction_service.get_user_predictions(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return predictions

@router.get("/{prediction_id}", response_model=prediction_schemas.Prediction)
def read_prediction(
    *,
    db: Session = Depends(get_db),
    prediction_id: str,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get prediction by ID.
    """
    prediction = prediction_service.get_prediction(db=db, prediction_id=prediction_id)
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    if prediction.user_id != current_user.id and not current_user.role == "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return prediction

@router.post("/{prediction_id}/review", response_model=prediction_schemas.DoctorReview)
def create_review(
    *,
    db: Session = Depends(get_db),
    prediction_id: str,
    review_in: prediction_schemas.DoctorReviewCreate,
    current_user: User = Depends(deps.get_current_doctor)
) -> Any:
    """
    Create review for a prediction.
    """
    prediction = prediction_service.get_prediction(db=db, prediction_id=prediction_id)
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    existing_review = prediction_service.get_doctor_review(
        db=db, prediction_id=prediction_id
    )
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already exists"
        )
    
    review = prediction_service.create_doctor_review(
        db=db,
        prediction_id=prediction_id,
        doctor_id=current_user.id,
        obj_in=review_in
    )
    return review

@router.put("/{prediction_id}/review", response_model=prediction_schemas.DoctorReview)
def update_review(
    *,
    db: Session = Depends(get_db),
    prediction_id: str,
    review_in: prediction_schemas.DoctorReviewCreate,
    current_user: User = Depends(deps.get_current_doctor)
) -> Any:
    """
    Update review for a prediction.
    """
    review = prediction_service.get_doctor_review(db=db, prediction_id=prediction_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    if review.doctor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    review = prediction_service.update_doctor_review(
        db=db,
        db_obj=review,
        obj_in=review_in
    )
    return review

@router.get("/doctor/reviews", response_model=List[prediction_schemas.DoctorReview])
def read_doctor_reviews(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_doctor)
) -> Any:
    """
    Get all reviews by current doctor.
    """
    reviews = prediction_service.get_doctor_reviews(
        db=db, doctor_id=current_user.id, skip=skip, limit=limit
    )
    return reviews