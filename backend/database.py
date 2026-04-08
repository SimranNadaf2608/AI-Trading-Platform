from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration (Local SQLite)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "aitrade_v2.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.utcnow().replace(tzinfo=None))
    updated_at = Column(DateTime, default=lambda: datetime.utcnow().replace(tzinfo=None), onupdate=lambda: datetime.utcnow().replace(tzinfo=None))

class OTPCode(Base):
    __tablename__ = "otp_codes"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), index=True, nullable=False)
    otp = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    attempt_count = Column(Integer, default=0)
    purpose = Column(String(20), default="signup")  # signup | reset
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    password_hash = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.utcnow().replace(tzinfo=None))

class BrokerAccount(Base):
    __tablename__ = "broker_accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    broker_name = Column(String, index=True)
    api_key = Column(String)
    api_secret = Column(String, nullable=True)
    balance = Column(Integer, default=10000)
    is_connected = Column(Boolean, default=True)

class Strategy(Base):
    __tablename__ = "strategies"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    name = Column(String, index=True)
    risk_level = Column(String)
    expected_return = Column(String)
    is_active = Column(Boolean, default=False)
    margin_allocated = Column(Integer, default=0)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    tx_id = Column(String, unique=True, index=True)
    date = Column(String)
    type = Column(String)
    asset_pair = Column(String)
    amount = Column(String)
    status = Column(String)
    profit = Column(String)

# Create engine and session
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
