from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class PasswordReset(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class OTPResponse(BaseModel):
    message: str
    can_resend_after: Optional[int] = None
    is_locked: Optional[bool] = False
    lockout_until: Optional[datetime] = None

class VerifyResponse(BaseModel):
    message: str
    success: bool
    user: Optional[UserResponse] = None
    token: Optional[str] = None
