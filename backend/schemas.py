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

class BrokerConnectRequest(BaseModel):
    broker_name: str
    api_key: str
    api_secret: Optional[str] = None

class BrokerResponse(BaseModel):
    id: int
    broker_name: str
    balance: float
    is_connected: bool
    
    class Config:
        from_attributes = True

class StrategyResponse(BaseModel):
    id: int
    name: str
    risk_level: str
    expected_return: str
    is_active: bool
    margin_allocated: float

    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    id: int
    tx_id: str
    date: str
    type: str
    asset_pair: str
    amount: str
    status: str
    profit: str

    class Config:
        from_attributes = True
