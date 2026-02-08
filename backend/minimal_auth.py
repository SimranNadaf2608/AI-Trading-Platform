from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import random
import os
from datetime import datetime, timedelta

app = FastAPI(title="Minimal Auth Test")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    confirm_password: str

class OTPResponse(BaseModel):
    message: str
    otp: Optional[str] = None
    can_resend_after: Optional[int] = None

@app.post("/auth/send-otp", response_model=OTPResponse)
async def send_otp(request: SignupRequest):
    """Minimal OTP endpoint for testing"""
    try:
        # Basic validation
        if request.password != request.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        
        # Generate OTP
        otp = str(random.randint(100000, 999999))
        
        return OTPResponse(
            message=f"OTP generated: {otp}",
            otp=otp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Add API endpoints that frontend needs
@app.get("/api/stocks")
async def get_stocks():
    """Get mock stocks data"""
    return {
        "stocks": [
            {"symbol": "AAPL", "name": "Apple Inc.", "price": 165.87, "change": 2.5, "changePercent": 2.54, "volume": 43789770},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 2837.55, "change": 37.01, "changePercent": 0.23, "volume": 922864},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "price": 338.55, "change": -1.04, "changePercent": 0.27, "volume": 29566063},
            {"symbol": "TSLA", "name": "Tesla Inc.", "price": 1165.84, "change": -6.01, "changePercent": -1.6, "volume": 44568113},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "price": 3033.04, "change": 35.46, "changePercent": -0.59, "volume": 7084421}
        ]
    }

@app.get("/api/analytics")
async def get_analytics():
    """Get mock analytics data"""
    return {
        "totalTrades": 481,
        "winRate": 94.8,
        "totalProfit": 9155.04,
        "dailyChange": 2.81,
        "weeklyData": [
            {"day": "Mon", "value": 1107.53},
            {"day": "Tue", "value": 1190.68},
            {"day": "Wed", "value": 3136.09},
            {"day": "Thu", "value": 2107.53},
            {"day": "Fri", "value": 1107.53},
            {"day": "Sat", "value": 1107.53},
            {"day": "Sun", "value": 1107.53}
        ],
        "topPerformers": [
            {"symbol": "AAPL", "gain": 12.5},
            {"symbol": "GOOGL", "gain": 8.3},
            {"symbol": "MSFT", "gain": 6.2}
        ],
        "marketSentiment": "Bullish",
        "recommendations": {
            "buy": 3,
            "hold": 2,
            "sell": 1
        }
    }

class OTPVerify(BaseModel):
    email: str
    otp: str

@app.post("/auth/verify-otp", response_model=dict)
async def verify_otp(request: OTPVerify):
    """Verify OTP and complete registration"""
    try:
        # For testing, accept any 6-digit OTP
        if len(request.otp) == 6 and request.otp.isdigit():
            return {
                "success": True,
                "message": "OTP verified successfully!",
                "token": "mock-jwt-token-12345"
            }
        else:
            return {
                "success": False,
                "message": "Invalid OTP. Please try again."
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Verification failed: {str(e)}"
        }

@app.get("/")
async def root():
    return {"message": "Minimal auth server running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
