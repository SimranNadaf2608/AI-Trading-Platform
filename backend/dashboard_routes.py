from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List

from database import get_db, User, BrokerAccount, Strategy, Transaction
from schemas import BrokerConnectRequest, BrokerResponse, StrategyResponse, TransactionResponse
from auth_utils import verify_token

router = APIRouter()
security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Extract user_id from JWT token"""
    token_data = verify_token(credentials.credentials)
    if not token_data or "user_id" not in token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )
    user_id = token_data["user_id"]
    return user_id

# -----------------------------------------------------
# BROKERS ENDPOINTS
# -----------------------------------------------------

@router.get("/brokers", response_model=List[BrokerResponse])
def get_brokers(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Fetch all connected brokers for the current user"""
    brokers = db.query(BrokerAccount).filter(BrokerAccount.user_id == user_id).all()
    return brokers

@router.post("/brokers/connect", response_model=BrokerResponse)
def connect_broker(request: BrokerConnectRequest, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Connect a new broker API"""
    existing = db.query(BrokerAccount).filter(
        and_(BrokerAccount.user_id == user_id, BrokerAccount.broker_name == request.broker_name)
    ).first()
    
    if existing:
        existing.api_key = request.api_key
        existing.api_secret = request.api_secret
        existing.is_connected = True
        db.commit()
        db.refresh(existing)
        return existing
        
    new_broker = BrokerAccount(
        user_id=user_id,
        broker_name=request.broker_name,
        api_key=request.api_key,
        api_secret=request.api_secret,
        balance=10000.00,  # Mock initial balance
        is_connected=True
    )
    db.add(new_broker)
    db.commit()
    db.refresh(new_broker)
    return new_broker

@router.delete("/brokers/{broker_id}")
def disconnect_broker(broker_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    broker = db.query(BrokerAccount).filter(
        and_(BrokerAccount.id == broker_id, BrokerAccount.user_id == user_id)
    ).first()
    
    if not broker:
        raise HTTPException(status_code=404, detail="Broker account not found")
        
    db.delete(broker)
    db.commit()
    return {"message": "Broker disconnected successfully"}

# -----------------------------------------------------
# STRATEGIES ENDPOINTS
# -----------------------------------------------------

@router.get("/strategies", response_model=List[StrategyResponse])
def get_strategies(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Fetch all strategies available/deployed by user"""
    # Fetch system defaults if the user has no strategies instantiated
    user_strats = db.query(Strategy).filter(Strategy.user_id == user_id).all()
    
    if not user_strats:
        # Create some default records for the user dynamically
        defaults = [
            Strategy(user_id=user_id, name="Arbitrage Scout", risk_level="Low", expected_return="+12.4%", is_active=True, margin_allocated=500.0),
            Strategy(user_id=user_id, name="Momentum Breakout", risk_level="High", expected_return="+45.2%", is_active=False),
            Strategy(user_id=user_id, name="Mean Reversion", risk_level="Medium", expected_return="+22.1%", is_active=False),
            Strategy(user_id=user_id, name="Grid Trading Bot", risk_level="Low", expected_return="+8.9%", is_active=False),
        ]
        for s in defaults:
            db.add(s)
        db.commit()
        user_strats = db.query(Strategy).filter(Strategy.user_id == user_id).all()
        
    return user_strats

@router.post("/strategies/{strategy_id}/deploy")
def toggle_strategy(strategy_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Toggle strategy deployment on/off"""
    strategy = db.query(Strategy).filter(
        and_(Strategy.id == strategy_id, Strategy.user_id == user_id)
    ).first()
    
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
        
    strategy.is_active = not strategy.is_active
    db.commit()
    return {"message": f"Strategy {'deployed' if strategy.is_active else 'stopped'} successfully", "is_active": strategy.is_active}

# -----------------------------------------------------
# TRANSACTIONS ENDPOINTS
# -----------------------------------------------------

@router.get("/reports/transactions", response_model=List[TransactionResponse])
def get_transactions(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Fetch user's transaction history logs"""
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.id.desc()).all()
    
    if not transactions:
        import uuid
        # Mock historical data insertion for presentation
        m_transactions = [
            Transaction(user_id=user_id, tx_id=f"TRX-{uuid.uuid4().hex[:6].upper()}", date="Mar 30, 2026", type="Buy", asset_pair="BTC/USD", amount="$4,200", status="Completed", profit="-"),
            Transaction(user_id=user_id, tx_id=f"TRX-{uuid.uuid4().hex[:6].upper()}", date="Mar 30, 2026", type="Sell", asset_pair="ETH/USD", amount="$1,100", status="Completed", profit="+$145.20"),
            Transaction(user_id=user_id, tx_id=f"TRX-{uuid.uuid4().hex[:6].upper()}", date="Mar 29, 2026", type="Buy", asset_pair="SOL/USD", amount="$850", status="Completed", profit="-"),
        ]
        for t in m_transactions:
            db.add(t)
        db.commit()
        transactions = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.id.desc()).all()
        
    return transactions
