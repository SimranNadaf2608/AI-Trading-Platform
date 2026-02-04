from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

app = FastAPI(title="AITrade API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Stock(BaseModel):
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: int

class PredictionRequest(BaseModel):
    symbol: str
    days: Optional[int] = 7

class PredictionResponse(BaseModel):
    symbol: str
    current_price: float
    predicted_price: float
    confidence: float
    recommendation: str
    prediction_date: str

class TradeRequest(BaseModel):
    symbol: str
    quantity: int
    order_type: str  # 'buy' or 'sell'
    price: Optional[float] = None

class PortfolioItem(BaseModel):
    symbol: str
    quantity: int
    average_price: float
    current_price: float
    total_value: float
    profit_loss: float
    profit_loss_percent: float

class Analytics(BaseModel):
    total_invested: float
    total_value: float
    total_profit_loss: float
    profit_loss_percent: float
    cash_balance: float
    total_assets: float
    num_positions: int

class Balance(BaseModel):
    balance: float

# Mock data
STOCKS_DATA = [
    {"symbol": "AAPL", "price": 195.89, "change": 2.45, "change_percent": 1.27, "volume": 52341234},
    {"symbol": "GOOGL", "price": 139.62, "change": -1.23, "change_percent": -0.87, "volume": 28456789},
    {"symbol": "MSFT", "price": 378.85, "change": 4.12, "change_percent": 1.10, "volume": 19876543},
    {"symbol": "AMZN", "price": 155.33, "change": 3.67, "change_percent": 2.42, "volume": 41234567},
    {"symbol": "TSLA", "price": 242.84, "change": -5.21, "change_percent": -2.10, "volume": 98765432},
    {"symbol": "META", "price": 484.03, "change": 6.89, "change_percent": 1.44, "volume": 34567890},
    {"symbol": "NVDA", "price": 875.28, "change": 12.45, "change_percent": 1.44, "volume": 45678901},
    {"symbol": "JPM", "price": 148.92, "change": 0.78, "change_percent": 0.53, "volume": 12345678}
]

# API Routes
@app.get("/")
async def root():
    return {"message": "AITrade API is running"}

@app.get("/api/stocks", response_model=List[Stock])
async def get_stocks():
    """Get all available stocks with current prices"""
    return STOCKS_DATA

@app.get("/api/stocks/{symbol}", response_model=Stock)
async def get_stock(symbol: str):
    """Get specific stock information"""
    stock = next((stock for stock in STOCKS_DATA if stock["symbol"] == symbol.upper()), None)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_stock(request: PredictionRequest):
    """AI-powered stock prediction"""
    stock = next((stock for stock in STOCKS_DATA if stock["symbol"] == request.symbol.upper()), None)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Mock AI prediction
    current_price = stock["price"]
    price_change = random.uniform(-0.10, 0.15)  # -10% to +15%
    predicted_price = current_price * (1 + price_change)
    confidence = random.uniform(0.75, 0.95)
    
    if price_change > 0.05:
        recommendation = "BUY"
    elif price_change < -0.05:
        recommendation = "SELL"
    else:
        recommendation = "HOLD"
    
    prediction_date = (datetime.now() + timedelta(days=request.days)).strftime("%Y-%m-%d")
    
    return PredictionResponse(
        symbol=request.symbol.upper(),
        current_price=current_price,
        predicted_price=predicted_price,
        confidence=confidence,
        recommendation=recommendation,
        prediction_date=prediction_date
    )

@app.post("/api/trade")
async def execute_trade(trade: TradeRequest):
    """Execute a trade"""
    stock = next((stock for stock in STOCKS_DATA if stock["symbol"] == trade.symbol.upper()), None)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Mock trade execution
    trade_price = trade.price if trade.price else stock["price"]
    total_value = trade.quantity * trade_price
    
    return {
        "success": True,
        "message": f"{trade.order_type.upper()} order executed",
        "symbol": trade.symbol.upper(),
        "quantity": trade.quantity,
        "price": trade_price,
        "total_value": total_value,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/portfolio", response_model=List[PortfolioItem])
async def get_portfolio():
    """Get user's portfolio"""
    # Mock portfolio data
    portfolio_data = [
        {
            "symbol": "AAPL",
            "quantity": 50,
            "average_price": 180.50,
            "current_price": 195.89,
            "total_value": 9794.50,
            "profit_loss": 772.50,
            "profit_loss_percent": 8.56
        },
        {
            "symbol": "GOOGL",
            "quantity": 25,
            "average_price": 135.00,
            "current_price": 139.62,
            "total_value": 3490.50,
            "profit_loss": 115.50,
            "profit_loss_percent": 3.42
        },
        {
            "symbol": "MSFT",
            "quantity": 30,
            "average_price": 365.00,
            "current_price": 378.85,
            "total_value": 11365.50,
            "profit_loss": 415.50,
            "profit_loss_percent": 3.79
        }
    ]
    
    return portfolio_data

@app.get("/api/balance", response_model=Balance)
async def get_balance():
    """Get account balance"""
    return Balance(balance=15420.75)

@app.get("/api/analytics", response_model=Analytics)
async def get_analytics():
    """Get portfolio analytics"""
    portfolio = await get_portfolio()
    balance = await get_balance()
    
    total_invested = sum(item["average_price"] * item["quantity"] for item in portfolio)
    total_value = sum(item["total_value"] for item in portfolio)
    total_profit_loss = total_value - total_invested
    profit_loss_percent = (total_profit_loss / total_invested) * 100 if total_invested > 0 else 0
    
    return Analytics(
        total_invested=total_invested,
        total_value=total_value,
        total_profit_loss=total_profit_loss,
        profit_loss_percent=profit_loss_percent,
        cash_balance=balance.balance,
        total_assets=total_value + balance.balance,
        num_positions=len(portfolio)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
