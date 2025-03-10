from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, assessments, doctor_reviews, predictions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(assessments.router, prefix="/assessments", tags=["assessments"])
api_router.include_router(doctor_reviews.router, prefix="/doctor-reviews", tags=["doctor-reviews"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])