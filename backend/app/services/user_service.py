from typing import Optional
from sqlalchemy.orm import Session
import uuid
from ..core.security import get_password_hash, verify_password
from ..models.models import User
from app.schemas.user import UserCreate, UserUpdate

def get(db: Session, user_id: int) -> Optional[User]:
    """
    Get a user by ID.
    """
    return db.query(User).filter(User.id == user_id).first()

def get_by_email(db: Session, *, email: str) -> Optional[User]:
    """
    Get a user by email.
    """
    return db.query(User).filter(User.email == email).first()

def authenticate(db: Session, *, email: str, password: str) -> Optional[User]:
    user = get_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create(db: Session, *, obj_in: UserCreate) -> User:
    """
    Create a new user.
    """
    db_obj = User(
        id=str(uuid.uuid4()),
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        full_name=obj_in.full_name,
        role=obj_in.role,
        is_active=True
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(db: Session, *, db_obj: User, obj_in: UserUpdate) -> User:
    """
    Update a user.
    """
    update_data = obj_in.dict(exclude_unset=True)
    if update_data.get("password"):
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["hashed_password"] = hashed_password
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def is_active(user: User) -> bool:
    """
    Check if a user is active.
    """
    return user.is_active

def is_doctor(user: User) -> bool:
    """
    Check if a user is a doctor.
    """
    return user.role == "DOCTOR"

def is_patient(user: User) -> bool:
    """
    Check if a user is a patient.
    """
    return user.role == "PATIENT"