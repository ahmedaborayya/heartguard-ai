from app.core.config import settings
from app.core.database import engine
from app.models.user import User
from app.models.assessment import Assessment
from app.models.doctor_review import DoctorReview

print("All imports successful!")
print(f"Database URI: {settings.SQLALCHEMY_DATABASE_URI}")