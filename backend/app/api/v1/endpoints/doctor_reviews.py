from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....core.database import get_db
from ....models.doctor_review import DoctorReview
from ....schemas.doctor_review import DoctorReviewCreate, DoctorReview as DoctorReviewSchema, DoctorReviewUpdate

router = APIRouter()

@router.get("/", response_model=List[DoctorReviewSchema])
def read_doctor_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reviews = db.query(DoctorReview).offset(skip).limit(limit).all()
    return reviews

@router.post("/", response_model=DoctorReviewSchema)
def create_doctor_review(review: DoctorReviewCreate, db: Session = Depends(get_db)):
    db_review = DoctorReview(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/{review_id}", response_model=DoctorReviewSchema)
def read_doctor_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(DoctorReview).filter(DoctorReview.id == review_id).first()
    if db_review is None:
        raise HTTPException(status_code=404, detail="Doctor review not found")
    return db_review

@router.put("/{review_id}", response_model=DoctorReviewSchema)
def update_doctor_review(review_id: int, review: DoctorReviewUpdate, db: Session = Depends(get_db)):
    db_review = db.query(DoctorReview).filter(DoctorReview.id == review_id).first()
    if db_review is None:
        raise HTTPException(status_code=404, detail="Doctor review not found")
    
    update_data = review.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_review, field, value)
    
    db.commit()
    db.refresh(db_review)
    return db_review