from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import random
from datetime import datetime, timedelta

router = APIRouter()

# Mock stocks data
@router.get("/stocks")
async def get_stocks():
    """Get mock stocks data"""
    try:
        stocks = [
            {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "price": round(random.uniform(150, 200), 2),
                "change": round(random.uniform(-5, 5), 2),
                "changePercent": round(random.uniform(-3, 3), 2),
                "volume": random.randint(1000000, 50000000)
            },
            {
                "symbol": "GOOGL",
                "name": "Alphabet Inc.",
                "price": round(random.uniform(2500, 3000), 2),
                "change": round(random.uniform(-50, 50), 2),
                "changePercent": round(random.uniform(-2, 2), 2),
                "volume": random.randint(500000, 2000000)
            },
            {
                "symbol": "MSFT",
                "name": "Microsoft Corporation",
                "price": round(random.uniform(300, 400), 2),
                "change": round(random.uniform(-10, 10), 2),
                "changePercent": round(random.uniform(-3, 3), 2),
                "volume": random.randint(1000000, 30000000)
            },
            {
                "symbol": "TSLA",
                "name": "Tesla Inc.",
                "price": round(random.uniform(800, 1200), 2),
                "change": round(random.uniform(-30, 30), 2),
                "changePercent": round(random.uniform(-5, 5), 2),
                "volume": random.randint(5000000, 50000000)
            },
            {
                "symbol": "AMZN",
                "name": "Amazon.com Inc.",
                "price": round(random.uniform(3000, 4000), 2),
                "change": round(random.uniform(-50, 50), 2),
                "changePercent": round(random.uniform(-2, 2), 2),
                "volume": random.randint(2000000, 10000000)
            }
        ]
        
        return {"stocks": stocks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mock analytics data
@router.get("/analytics")
async def get_analytics():
    """Get mock analytics data"""
    try:
        analytics = {
            "totalTrades": random.randint(100, 1000),
            "winRate": round(random.uniform(60, 95), 1),
            "totalProfit": round(random.uniform(1000, 50000), 2),
            "dailyChange": round(random.uniform(-5, 15), 2),
            "weeklyData": [
                {"day": "Mon", "value": round(random.uniform(1000, 5000), 2)},
                {"day": "Tue", "value": round(random.uniform(1000, 5000), 2)},
                {"day": "Wed", "value": round(random.uniform(1000, 5000), 2)},
                {"day": "Thu", "value": round(random.uniform(1000, 5000), 2)},
                {"day": "Fri", "value": round(random.uniform(1000, 5000), 2)},
                {"day": "Sat", "value": round(random.uniform(1000, 5000), 2)},
                {"day": "Sun", "value": round(random.uniform(1000, 5000), 2)}
            ],
            "topPerformers": [
                {"symbol": "AAPL", "gain": round(random.uniform(5, 20), 2)},
                {"symbol": "GOOGL", "gain": round(random.uniform(3, 15), 2)},
                {"symbol": "MSFT", "gain": round(random.uniform(2, 12), 2)}
            ],
            "marketSentiment": random.choice(["Bullish", "Bearish", "Neutral"]),
            "recommendations": {
                "buy": random.randint(1, 5),
                "hold": random.randint(1, 3),
                "sell": random.randint(0, 2)
            }
        }
        
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
