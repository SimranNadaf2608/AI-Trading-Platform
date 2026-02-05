from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timedelta
from typing import Optional

from database import get_db, User, OTPCode, OTPAttempt
from schemas import (
    UserCreate, UserLogin, OTPRequest, OTPVerify, 
    PasswordReset, UserResponse, Token, OTPResponse, VerifyResponse
)
from auth_utils import (
    verify_password, get_password_hash, create_access_token, 
    verify_token, generate_otp, is_otp_expired, can_attempt_otp, get_lockout_time
)
from email_service import send_otp_email

app = FastAPI(title="AITrade Authentication API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/send-otp", response_model=OTPResponse)
async def send_otp(request: OTPRequest, db: Session = Depends(get_db)):
    """Send OTP for registration or password reset"""
    email = request.email
    
    # Check if user is locked out
    attempt_record = db.query(OTPAttempt).filter(OTPAttempt.email == email).first()
    if attempt_record:
        can_attempt, lockout_until = can_attempt_otp(attempt_record.attempt_count, attempt_record.lockout_until)
        if not can_attempt:
            return OTPResponse(
                message="Too many failed attempts. Please try again later.",
                is_locked=True,
                lockout_until=lockout_until
            )
    
    # Check if there's a recent unused OTP (within 60 seconds)
    recent_otp = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.is_used == False,
            OTPCode.expires_at > datetime.utcnow() + timedelta(minutes=4)
        )
    ).first()
    
    if recent_otp:
        return OTPResponse(
            message="OTP already sent. Please wait before requesting a new one.",
            can_resend_after=60
        )
    
    # Generate and store OTP
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Mark any existing OTPs as used
    db.query(OTPCode).filter(OTPCode.email == email).update({"is_used": True})
    
    # Create new OTP record
    db_otp = OTPCode(
        email=email,
        otp=otp,
        expires_at=expires_at,
        is_used=False,
        attempts=0
    )
    db.add(db_otp)
    db.commit()
    
    # Send OTP email
    try:
        await send_otp_email(email, otp, "verification")
        return OTPResponse(message="OTP sent successfully to your email")
    except Exception as e:
        db.delete(db_otp)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP. Please try again."
        )

@app.post("/auth/verify-otp", response_model=VerifyResponse)
async def verify_otp(request: OTPVerify, db: Session = Depends(get_db)):
    """Verify OTP and complete registration"""
    email = request.email
    otp = request.otp
    
    # Get OTP record
    otp_record = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.otp == otp,
            OTPCode.is_used == False
        )
    ).first()
    
    if not otp_record:
        # Update attempt count
        attempt_record = db.query(OTPAttempt).filter(OTPAttempt.email == email).first()
        if not attempt_record:
            attempt_record = OTPAttempt(email=email, attempt_count=1)
            db.add(attempt_record)
        else:
            attempt_record.attempt_count += 1
            if attempt_record.attempt_count >= 5:
                attempt_record.lockout_until = get_lockout_time()
        db.commit()
        
        return VerifyResponse(
            message="Invalid OTP",
            success=False
        )
    
    # Check if OTP is expired
    if is_otp_expired(otp_record.expires_at):
        return VerifyResponse(
            message="OTP has expired. Please request a new one.",
            success=False
        )
    
    # Mark OTP as used
    otp_record.is_used = True
    db.commit()
    
    # Reset attempt count
    attempt_record = db.query(OTPAttempt).filter(OTPAttempt.email == email).first()
    if attempt_record:
        attempt_record.attempt_count = 0
        attempt_record.lockout_until = None
        db.commit()
    
    # Check if user exists (for password reset) or create new user (for registration)
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        # User exists - this is for password reset
        token = create_access_token(data={"sub": user.email, "user_id": user.id})
        user_response = UserResponse(
            id=user.id,
            email=user.email,
            is_verified=user.is_verified,
            created_at=user.created_at
        )
        return VerifyResponse(
            message="OTP verified successfully. You can now reset your password.",
            success=True,
            user=user_response,
            token=token
        )
    else:
        # New user - create account
        # For now, we'll create a temporary user and require password in next step
        # In a real implementation, you might want to collect password during initial OTP request
        return VerifyResponse(
            message="OTP verified successfully. Please set your password to complete registration.",
            success=True
        )

@app.post("/auth/register", response_model=Token)
async def register(email: str, password: str, db: Session = Depends(get_db)):
    """Complete user registration with password"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        hashed_password=hashed_password,
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        is_verified=user.is_verified,
        created_at=user.created_at
    )
    
    return Token(
        access_token=token,
        token_type="bearer",
        user=user_response
    )

@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """User login"""
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email first"
        )
    
    # Create access token
    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        is_verified=user.is_verified,
        created_at=user.created_at
    )
    
    return Token(
        access_token=token,
        token_type="bearer",
        user=user_response
    )

@app.post("/auth/forgot-password", response_model=OTPResponse)
async def forgot_password(request: OTPRequest, db: Session = Depends(get_db)):
    """Send OTP for password reset"""
    email = request.email
    
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Don't reveal if user exists or not for security
        return OTPResponse(message="If an account exists, an OTP will be sent")
    
    # Check if user is locked out
    attempt_record = db.query(OTPAttempt).filter(OTPAttempt.email == email).first()
    if attempt_record:
        can_attempt, lockout_until = can_attempt_otp(attempt_record.attempt_count, attempt_record.lockout_until)
        if not can_attempt:
            return OTPResponse(
                message="Too many failed attempts. Please try again later.",
                is_locked=True,
                lockout_until=lockout_until
            )
    
    # Check if there's a recent unused OTP (within 60 seconds)
    recent_otp = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.is_used == False,
            OTPCode.expires_at > datetime.utcnow() + timedelta(minutes=4)
        )
    ).first()
    
    if recent_otp:
        return OTPResponse(
            message="OTP already sent. Please wait before requesting a new one.",
            can_resend_after=60
        )
    
    # Generate and store OTP
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Mark any existing OTPs as used
    db.query(OTPCode).filter(OTPCode.email == email).update({"is_used": True})
    
    # Create new OTP record
    db_otp = OTPCode(
        email=email,
        otp=otp,
        expires_at=expires_at,
        is_used=False,
        attempts=0
    )
    db.add(db_otp)
    db.commit()
    
    # Send OTP email
    try:
        await send_otp_email(email, otp, "password_reset")
        return OTPResponse(message="Password reset OTP sent successfully to your email")
    except Exception as e:
        db.delete(db_otp)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP. Please try again."
        )

@app.post("/auth/reset-password")
async def reset_password(request: PasswordReset, db: Session = Depends(get_db)):
    """Reset password with OTP verification"""
    email = request.email
    otp = request.otp
    new_password = request.new_password
    
    # Get OTP record
    otp_record = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.otp == otp,
            OTPCode.is_used == False
        )
    ).first()
    
    if not otp_record:
        # Update attempt count
        attempt_record = db.query(OTPAttempt).filter(OTPAttempt.email == email).first()
        if not attempt_record:
            attempt_record = OTPAttempt(email=email, attempt_count=1)
            db.add(attempt_record)
        else:
            attempt_record.attempt_count += 1
            if attempt_record.attempt_count >= 5:
                attempt_record.lockout_until = get_lockout_time()
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Check if OTP is expired
    if is_otp_expired(otp_record.expires_at):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new one."
        )
    
    # Mark OTP as used
    otp_record.is_used = True
    db.commit()
    
    # Get user and update password
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    
    # Reset attempt count
    attempt_record = db.query(OTPAttempt).filter(OTPAttempt.email == email).first()
    if attempt_record:
        attempt_record.attempt_count = 0
        attempt_record.lockout_until = None
        db.commit()
    
    return {"message": "Password reset successfully"}

# Dependency to get current user
async def get_current_user(token: str = None, db: Session = Depends(get_db)):
    """Get current user from JWT token"""
    if not token:
        return None
        
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    user_id: int = payload.get("user_id")
    
    if email is None or user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id, User.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_endpoint(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
