from fastapi import APIRouter, Depends
from database import get_db
from models import User
from schemas import UserResponse
from dependencies import get_current_user

router = APIRouter()

@router.get("/users/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obter informações do usuário atual"""
    return current_user
