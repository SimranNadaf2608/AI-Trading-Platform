from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta

from database import get_db, User, OTPCode
from schemas import (
    SignupRequest, UserLogin, OTPRequest, OTPVerify, 
    PasswordReset, UserResponse, Token, OTPResponse, VerifyResponse
)
from auth_utils import (
    verify_password, get_password_hash, create_access_token, 
    verify_token, generate_otp, is_otp_expired, is_resend_allowed, MAX_OTP_ATTEMPTS
)
from email_service import send_otp_email
from api_routes import router as api_router

app = FastAPI(title="AITrade Authentication API", version="1.0.0")
security = HTTPBearer()

# Include API routes
app.include_router(api_router, prefix="/api", tags=["api"])

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    print("🏠 Root endpoint called")
    return {"message": "AITrade Auth Server is running on port 8001"}

@app.post("/auth/send-otp", response_model=OTPResponse)
async def send_otp(request: SignupRequest, db: Session = Depends(get_db)):
    """Send OTP for registration"""
    print(f"🚀 send_otp function called for email: {request.email}")
    print(f"📋 Request data: {request.first_name} {request.last_name}")
    
    email = request.email

    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user and existing_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    last_otp = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.is_used == False,
            OTPCode.purpose == "signup"
        )
    ).order_by(OTPCode.created_at.desc()).first()

    if last_otp and not is_resend_allowed(last_otp.created_at.replace(tzinfo=None) if last_otp.created_at.tzinfo else last_otp.created_at):
        return OTPResponse(
            message="OTP already sent. Please wait before requesting a new one.",
            can_resend_after=60
        )

    otp = generate_otp()
    print(f"🔢 Generated OTP: {otp}")
    print(f"📧 Sending OTP to: {email}")
    print(f"⏰ Generated at: {datetime.utcnow()}")
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    print(f"⏳ Expires at: {expires_at}")


    # Mark existing unused OTPs as used
    db.query(OTPCode).filter(
        and_(OTPCode.email == email, OTPCode.is_used == False, OTPCode.purpose == "signup")
    ).update({"is_used": True})

    db_otp = OTPCode(
        email=email,
        otp=otp,
        expires_at=expires_at,
        is_used=False,
        attempt_count=0,
        purpose="signup",
        first_name=request.first_name,
        last_name=request.last_name,
        password_hash=get_password_hash(request.password),
    )
    db.add(db_otp)
    db.commit()

    try:
        print(f"About to send email to {email} with OTP {otp}")
        await send_otp_email(email, otp, "verification")
        print(f"Email sent successfully to {email}")
        print(f"OTP for {email}: {otp}")  # Debug: Print OTP to console
        return OTPResponse(message="OTP sent successfully to your email")
    except Exception as e:
        print(f"Email error: {e}")  # Debug: Print error
        print(f"Email error type: {type(e).__name__}")  # Debug: Print error type
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
            OTPCode.is_used == False,
            OTPCode.purpose == "signup"
        )
    ).first()
    
    if not otp_record:
        # Update attempt count on latest active OTP
        latest_otp = db.query(OTPCode).filter(
            and_(
                OTPCode.email == email,
                OTPCode.is_used == False,
                OTPCode.purpose == "signup"
            )
        ).order_by(OTPCode.created_at.desc()).first()

        if latest_otp:
            latest_otp.attempt_count += 1
            if latest_otp.attempt_count >= MAX_OTP_ATTEMPTS:
                latest_otp.is_used = True
            db.commit()

        return VerifyResponse(
            message="Invalid OTP",
            success=False
        )
    
    # Check if OTP is expired
    if is_otp_expired(otp_record.expires_at):
        otp_record.is_used = True
        db.commit()
        return VerifyResponse(
            message="OTP has expired. Please request a new one.",
            success=False
        )

    if otp_record.attempt_count >= MAX_OTP_ATTEMPTS:
        otp_record.is_used = True
        db.commit()
        return VerifyResponse(
            message="OTP attempt limit exceeded. Please request a new code.",
            success=False
        )
    
    # Mark OTP as used
    otp_record.is_used = True
    db.commit()

    if not otp_record.first_name or not otp_record.last_name or not otp_record.password_hash:
        return VerifyResponse(
            message="Missing signup details. Please restart signup.",
            success=False
        )

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user and existing_user.is_verified:
        return VerifyResponse(
            message="User already exists.",
            success=False
        )

    if existing_user:
        existing_user.first_name = otp_record.first_name
        existing_user.last_name = otp_record.last_name
        existing_user.hashed_password = otp_record.password_hash
        existing_user.is_verified = True
        db.commit()
        db.refresh(existing_user)
        user = existing_user
    else:
        user = User(
            first_name=otp_record.first_name,
            last_name=otp_record.last_name,
            email=email,
            hashed_password=otp_record.password_hash,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    user_response = UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_verified=user.is_verified,
        created_at=user.created_at
    )

    return VerifyResponse(
        message="OTP verified successfully. Account created.",
        success=True,
        user=user_response,
        token=token
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
        first_name=user.first_name,
        last_name=user.last_name,
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
    
    # Check if there's a recent unused OTP (within 60 seconds)
    recent_otp = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.is_used == False,
            OTPCode.purpose == "reset"
        )
    ).order_by(OTPCode.created_at.desc()).first()
    
    if recent_otp and not is_resend_allowed(recent_otp.created_at):
        return OTPResponse(
            message="OTP already sent. Please wait before requesting a new one.",
            can_resend_after=60
        )
    
    # Generate and store OTP
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Mark any existing OTPs as used
    db.query(OTPCode).filter(
        and_(OTPCode.email == email, OTPCode.is_used == False, OTPCode.purpose == "reset")
    ).update({"is_used": True})
    
    # Create new OTP record
    db_otp = OTPCode(
        email=email,
        otp=otp,
        expires_at=expires_at,
        is_used=False,
        attempt_count=0,
        purpose="reset"
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
            OTPCode.is_used == False,
            OTPCode.purpose == "reset"
        )
    ).first()
    
    if not otp_record:
        latest_otp = db.query(OTPCode).filter(
            and_(
                OTPCode.email == email,
                OTPCode.is_used == False,
                OTPCode.purpose == "reset"
            )
        ).order_by(OTPCode.created_at.desc()).first()

        if latest_otp:
            latest_otp.attempt_count += 1
            if latest_otp.attempt_count >= MAX_OTP_ATTEMPTS:
                latest_otp.is_used = True
            db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Check if OTP is expired
    if is_otp_expired(otp_record.expires_at):
        otp_record.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new one."
        )

    if otp_record.attempt_count >= MAX_OTP_ATTEMPTS:
        otp_record.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP attempt limit exceeded. Please request a new one."
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
    
    return {"message": "Password reset successfully"}

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = verify_token(credentials.credentials)
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
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
