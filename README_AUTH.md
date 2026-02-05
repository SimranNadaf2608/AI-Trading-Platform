# AITrade Real-World Email OTP Authentication System

## 🚀 Complete Production-Ready Authentication System

This is a **real-world email OTP authentication system** built with React + FastAPI + SQL, using only free tools. It replaces mock authentication with production-ready email verification, JWT tokens, and secure password handling.

## 📋 Features Implemented

### 🔐 Authentication Features
- **Email OTP Verification** - Real 6-digit codes sent via Gmail SMTP
- **Secure Password Hashing** - bcrypt with salt
- **JWT Token Authentication** - 30-minute expiry with refresh
- **Account Lockout** - 5 failed attempts → 15-minute lockout
- **Password Reset** - OTP-based password recovery
- **Email Verification** - Required for account activation

### 🛡️ Security Features
- **5-minute OTP expiry** - Auto-expiring verification codes
- **Maximum 5 attempts** - Prevents brute force attacks
- **Account lockout** - 15-minute cooldown after failures
- **Rate limiting** - 60-second resend cooldown
- **Secure headers** - CORS and security middleware
- **Input validation** - Email format and password strength

### 📧 Email System
- **Gmail SMTP integration** - Free email service
- **Beautiful HTML templates** - Professional email design
- **Verification & Reset emails** - Different templates for each purpose
- **App password authentication** - Secure Gmail access

## 🛠️ Technology Stack

### Backend (FastAPI)
- **FastAPI 0.104.1** - Modern Python web framework
- **SQLAlchemy 2.0+** - Database ORM
- **PyMySQL** - MySQL database connector
- **FastAPI-Mail** - Email sending
- **Passlib[bcrypt]** - Password hashing
- **python-jose** - JWT tokens
- **python-dotenv** - Environment variables

### Frontend (React)
- **React 19.2.4** - Modern UI framework
- **TypeScript 4.9.5** - Type safety
- **Axios** - HTTP client with interceptors
- **Lucide React** - Icon library

### Database
- **MySQL/PostgreSQL** - Production database
- **Users table** - Account management
- **OTP codes table** - Verification codes
- **OTP attempts table** - Security tracking

## 📁 Project Structure

```
AITrade/
├── backend/
│   ├── auth_main.py          # Main FastAPI application
│   ├── database.py           # Database models and setup
│   ├── schemas.py            # Pydantic models
│   ├── auth_utils.py         # Authentication utilities
│   ├── email_service.py      # Email sending service
│   ├── requirements.txt      # Python dependencies
│   └── .env.example         # Environment template
├── frontend/
│   └── src/
│       ├── services/
│       │   └── authService.ts # API service layer
│       └── pages/
│           ├── SignupReal.tsx    # Real registration
│           ├── SigninReal.tsx     # Real login
│           └── ForgotPasswordReal.tsx # Real password reset
```

## 🚀 Quick Setup Guide

### 1. Database Setup

**MySQL (Recommended):**
```sql
CREATE DATABASE aitrade_auth;
CREATE USER 'aitrade_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON aitrade_auth.* TO 'aitrade_user'@'localhost';
FLUSH PRIVILEGES;
```

**PostgreSQL:**
```sql
CREATE DATABASE aitrade_auth;
CREATE USER aitrade_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aitrade_auth TO aitrade_user;
```

### 2. Gmail SMTP Setup

1. **Enable 2-Step Verification** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account → Security → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "AITrade Auth" and generate password
3. **Copy the 16-character app password**

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env file with your credentials
```

**Edit `.env` file:**
```env
# Database Configuration
DATABASE_URL=mysql+pymysql://aitrade_user:your_password@localhost:3306/aitrade_auth

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Email Configuration (Gmail SMTP)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password-16-chars
MAIL_FROM=AITrade <noreply@aitrade.com>

# Application Settings
DEBUG=False
ENVIRONMENT=production
```

### 4. Start Backend Server

```bash
# Start the FastAPI server
python auth_main.py

# Or use uvicorn directly
uvicorn auth_main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Create environment file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start React development server
npm start
```

## 🌐 API Endpoints

### Authentication Endpoints
- `POST /auth/send-otp` - Send OTP for registration
- `POST /auth/verify-otp` - Verify OTP and complete registration
- `POST /auth/register` - Complete user registration
- `POST /auth/login` - User login with JWT
- `POST /auth/forgot-password` - Send OTP for password reset
- `POST /auth/reset-password` - Reset password with OTP
- `GET /auth/me` - Get current user info

### API Examples

**Send OTP:**
```bash
curl -X POST "http://localhost:8000/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Verify OTP:**
```bash
curl -X POST "http://localhost:8000/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

**Login:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "yourpassword"}'
```

## 🔄 User Flow

### Registration Flow
1. **Email + Password** → Send OTP
2. **Enter 6-digit OTP** → Verify email
3. **Account Created** → Auto-login with JWT

### Login Flow
1. **Email + Password** → Verify credentials
2. **Check Verification** → Must be verified
3. **Return JWT** → Store in localStorage

### Password Reset Flow
1. **Enter Email** → Send OTP
2. **Enter OTP** → Verify identity
3. **New Password** → Reset complete

## 🛡️ Security Features

### OTP Security
- **5-minute expiry** - Codes auto-expire
- **5 attempts max** - Lockout after failures
- **15-minute lockout** - Security cooldown
- **Single use** - OTPs marked as used

### Password Security
- **bcrypt hashing** - Industry standard
- **8-character minimum** - Strong passwords
- **JWT tokens** - Secure authentication
- **Auto-logout** - Token expiry

### Email Security
- **App passwords** - No plain text passwords
- **TLS/SSL** - Encrypted email sending
- **Rate limiting** - Prevent spam
- **Professional templates** - Phishing resistance

## 🧪 Testing

### Test Credentials
- **Email**: Use any valid email address
- **Password**: Minimum 8 characters
- **OTP**: Check your email (real 6-digit code)

### Test Scenarios
1. **Successful Registration** → Complete flow
2. **Invalid OTP** → Error handling
3. **Expired OTP** → Time-based expiry
4. **Account Lockout** → 5 failed attempts
5. **Password Reset** → Full recovery flow

## 🚀 Production Deployment

### Environment Variables
```env
DATABASE_URL=your-production-database-url
SECRET_KEY=your-production-secret-key-32-chars-min
MAIL_USERNAME=your-production-email@gmail.com
MAIL_PASSWORD=your-production-app-password
DEBUG=False
ENVIRONMENT=production
```

### Security Checklist
- [ ] Change SECRET_KEY to random 32+ character string
- [ ] Use production database with SSL
- [ ] Enable HTTPS on frontend
- [ ] Set up email monitoring
- [ ] Configure rate limiting
- [ ] Enable logging and monitoring

## 📞 Support

This system uses **only free tools** and provides a **production-ready authentication experience** with real email OTP, secure password handling, and comprehensive security features.

**All components are fully functional and ready for production use!** 🎉
