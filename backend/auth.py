from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import hashlib
import os

# Configurações
SECRET_KEY = os.getenv("SECRET_KEY", "futmz-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dias

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar senha"""
    hash_input = hashlib.sha256(plain_password.encode()).hexdigest()
    return hash_input == hashed_password

def get_password_hash(password: str) -> str:
    """Hash da senha"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Criar token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    """Decodificar e validar token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
