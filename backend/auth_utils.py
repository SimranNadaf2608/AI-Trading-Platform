import random
import string
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OTP settings
OTP_EXPIRE_MINUTES = 5
MAX_OTP_ATTEMPTS = 5
OTP_LOCKOUT_MINUTES = 15

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def generate_otp() -> str:
    """Generate 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def is_otp_expired(expires_at: datetime) -> bool:
    """Check if OTP has expired"""
    return datetime.utcnow() > expires_at

def can_attempt_otp(attempts: int, lockout_until: Optional[datetime]) -> tuple[bool, Optional[datetime]]:
    """Check if user can attempt OTP verification"""
    if attempts >= MAX_OTP_ATTEMPTS:
        if lockout_until and datetime.utcnow() < lockout_until:
            return False, lockout_until
        else:
            # Reset attempts after lockout period
            return True, None
    return True, None

def get_lockout_time() -> datetime:
    """Get lockout expiration time"""
    return datetime.utcnow() + timedelta(minutes=OTP_LOCKOUT_MINUTES)
