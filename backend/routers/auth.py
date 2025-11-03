from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from database import get_db
from models import User
from schemas import UserCreate, UserResponse, UserLogin, Token
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

@router.post("/users/register", 
             response_model=UserResponse, 
             status_code=status.HTTP_201_CREATED,
             summary="Registrar novo usuário",
             description="Cria uma nova conta de usuário na plataforma")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registrar novo usuário"""
    # Verificar se usuário já existe
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já está em uso"
        )
    
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já está em uso"
        )
    
    # Criar novo usuário
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/users/login",
             response_model=Token,
             summary="Fazer login",
             description="Autentica o usuário e retorna um token JWT")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login e obter token JWT"""
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
