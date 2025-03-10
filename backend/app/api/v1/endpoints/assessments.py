from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....core.database import get_db
from ....models.assessment import Assessment
from ....schemas.assessment import AssessmentCreate, Assessment as AssessmentSchema, AssessmentUpdate

router = APIRouter()

@router.get("/", response_model=List[AssessmentSchema])
def read_assessments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assessments = db.query(Assessment).offset(skip).limit(limit).all()
    return assessments

@router.post("/", response_model=AssessmentSchema)
def create_assessment(assessment: AssessmentCreate, db: Session = Depends(get_db)):
    db_assessment = Assessment(**assessment.dict())
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment

@router.get("/{assessment_id}", response_model=AssessmentSchema)
def read_assessment(assessment_id: int, db: Session = Depends(get_db)):
    db_assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if db_assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return db_assessment

@router.put("/{assessment_id}", response_model=AssessmentSchema)
def update_assessment(assessment_id: int, assessment: AssessmentUpdate, db: Session = Depends(get_db)):
    db_assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if db_assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    update_data = assessment.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_assessment, field, value)
    
    db.commit()
    db.refresh(db_assessment)
    return db_assessment