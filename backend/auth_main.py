from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta, timezone

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
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    print("🏠 Root endpoint called")
    return {"message": "AITrade Auth Server is running on port 8000"}


# ----------------------------------------------------------------------------
# SEND OTP
# ----------------------------------------------------------------------------
@app.post("/auth/send-otp", response_model=OTPResponse)
async def send_otp(request: SignupRequest, db: Session = Depends(get_db)):
    """Send OTP for registration"""
    print(f"🚀 send_otp function called for email: {request.email}")
    print(f"📋 Request data: {request.first_name} {request.last_name}")

    email = request.email

    print("DEBUG → email:", request.email)
    print("DEBUG → password:", request.password)
    print("DEBUG → confirm_password:", request.confirm_password)

    # Ensure confirm password exists
    if not request.confirm_password:
        request.confirm_password = request.password

    # Check password match
    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user and existing_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists and is verified"
        )
    elif existing_user and not existing_user.is_verified:
        print(f"📧 Existing unverified user found: {email}")
    else:
        print(f"👤 New user signup: {email}")

    last_otp = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.is_used == False,
            OTPCode.purpose == "signup"
        )
    ).order_by(OTPCode.created_at.desc()).first()

    if last_otp and not is_resend_allowed(
        last_otp.created_at.replace(tzinfo=None)
        if last_otp.created_at.tzinfo
        else last_otp.created_at
    ):
        return OTPResponse(
            message="OTP already sent. Please wait before requesting a new one.",
            can_resend_after=60
        )

    otp = generate_otp()
    print(f"🔢 Generated OTP: {otp}")
    print(f"📧 Sending OTP to: {email}")

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    print(f"⏳ Expires at: {expires_at}")

    # Mark existing unused OTPs as used
    db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.is_used == False,
            OTPCode.purpose == "signup"
        )
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
        return OTPResponse(message="OTP sent successfully to your email")

    except Exception as e:
        print(f"Email error: {e}")
        db.delete(db_otp)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP. Please try again."
        )


# ----------------------------------------------------------------------------
# VERIFY OTP
# ----------------------------------------------------------------------------
@app.post("/auth/verify-otp", response_model=VerifyResponse)
async def verify_otp(request: OTPVerify, db: Session = Depends(get_db)):
    email = request.email
    otp = request.otp

    otp_record = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.otp == otp,
            OTPCode.is_used == False,
            OTPCode.purpose == "signup"
        )
    ).first()

    if not otp_record:
        return VerifyResponse(message="Invalid OTP", success=False)

    if is_otp_expired(otp_record.expires_at):
        otp_record.is_used = True
        db.commit()
        return VerifyResponse(message="OTP expired", success=False)

    otp_record.is_used = True
    db.commit()

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
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

    return VerifyResponse(
        message="OTP verified successfully",
        success=True,
        token=token
    )


# ----------------------------------------------------------------------------
# SIMPLE REGISTER (TEMPORARY)
# ----------------------------------------------------------------------------
@app.post("/auth/register")
def register(email: str, password: str):
    print(f"Registering user: {email}")
    return {
        "success": True,
        "message": "User registered successfully",
        "email": email
    }

# ----------------------------------------------------------------------------
# LOGIN
# ----------------------------------------------------------------------------
@app.post("/auth/login")
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """User login"""

    print(f"🔐 Login attempt for: {user_credentials.email}")

    user = db.query(User).filter(User.email == user_credentials.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=401,
            detail="Please verify your email first"
        )

    token = create_access_token(
        data={"sub": user.email, "user_id": user.id}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_verified": user.is_verified,
            "created_at": user.created_at
        }
    }

# ----------------------------------------------------------------------------
# FORGOT PASSWORD
# ----------------------------------------------------------------------------
@app.post("/auth/forgot-password", response_model=OTPResponse)
async def forgot_password(request: OTPRequest, db: Session = Depends(get_db)):
    print("🔐 Forgot password endpoint called")
    print("📧 Email:", request.email)

    email = request.email

    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    print("👤 User found:", user)

    if not user:
        print("❌ User not found")
        return OTPResponse(message="If an account exists, an OTP will be sent")

    # Generate OTP
    otp = generate_otp()
    print("🔢 Generated OTP:", otp)

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    # Mark existing reset OTPs as used
    db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.is_used == False,
            OTPCode.purpose == "reset"
        )
    ).update({"is_used": True})

    # Store new OTP
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

    print("💾 OTP stored in DB")

    # Send email
    try:
        await send_otp_email(email, otp, "password_reset")
        print("✅ Reset OTP email sent")
        return OTPResponse(message="Password reset OTP sent")
    except Exception as e:
        print("❌ Email error:", e)
        return OTPResponse(message="Failed to send OTP")

    # ----------------------------------------------------------------------------
# VERIFY RESET OTP
# ----------------------------------------------------------------------------
@app.post("/auth/verify-reset-otp")
async def verify_reset_otp(request: OTPVerify, db: Session = Depends(get_db)):
    print("🔐 Verify reset OTP called")
    print("📧 Email:", request.email)
    print("🔢 OTP:", request.otp)

    otp_record = db.query(OTPCode).filter(
        and_(
            OTPCode.email == request.email,
            OTPCode.otp == request.otp,
            OTPCode.is_used == False,
            OTPCode.purpose == "reset"
        )
    ).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if is_otp_expired(otp_record.expires_at):
        raise HTTPException(status_code=400, detail="OTP expired")

    print("✅ Reset OTP verified")
    return {"message": "OTP verified successfully"}


# ----------------------------------------------------------------------------
# RESET PASSWORD
# ----------------------------------------------------------------------------
@app.post("/auth/reset-password")
async def reset_password(request: PasswordReset, db: Session = Depends(get_db)):
    print("🔐 Reset password endpoint called")
    print("📧 Email:", request.email)
    print("🔢 OTP:", request.otp)

    email = request.email
    otp = request.otp
    new_password = request.new_password

    # Find OTP record
    otp_record = db.query(OTPCode).filter(
        and_(
            OTPCode.email == email,
            OTPCode.otp == otp,
            OTPCode.is_used == False,
            OTPCode.purpose == "reset"
        )
    ).first()

    if not otp_record:
        print("❌ Invalid OTP")
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Check expiry
    if is_otp_expired(otp_record.expires_at):
        otp_record.is_used = True
        db.commit()
        print("⏰ OTP expired")
        raise HTTPException(status_code=400, detail="OTP expired")

    # Find user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print("❌ User not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Update password
    user.hashed_password = get_password_hash(new_password)

    # Mark OTP as used
    otp_record.is_used = True

    db.commit()

    print("✅ Password reset successful")
    return {"message": "Password reset successful"}

    


# ----------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
