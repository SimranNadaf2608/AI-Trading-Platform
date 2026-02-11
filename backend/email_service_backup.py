from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import Optional
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

# Try Gmail SMTP first, fallback to Brevo
def get_email_config():
    """Get email configuration, trying Gmail first, then Brevo"""
    
    # Check for Gmail credentials
    gmail_username = os.getenv("GMAIL_USERNAME")
    gmail_password = os.getenv("GMAIL_PASSWORD")
    
    if gmail_username and gmail_password:
        print("📧 Using Gmail SMTP")
        return ConnectionConfig(
            MAIL_USERNAME=gmail_username,
            MAIL_PASSWORD=gmail_password,
            MAIL_FROM=gmail_username,
            MAIL_PORT=587,
            MAIL_SERVER="smtp.gmail.com",
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True,
            TIMEOUT=30
        )
    else:
        print("📧 Using Brevo SMTP (fallback)")
        return ConnectionConfig(
            MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
            MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
            MAIL_FROM=os.getenv("MAIL_FROM"),
            MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
            MAIL_SERVER=os.getenv("MAIL_SERVER"),
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=False,  # Disable cert validation for testing
            TIMEOUT=30
        )

# Email configuration
conf = get_email_config()
fm = FastMail(conf)

async def send_otp_email(email: EmailStr, otp: str, purpose: str = "verification"):
    """Send OTP email to user with fallback mechanism"""
    
    print(f"📧 Sending OTP email to: {email}")
    print(f"🔢 OTP Code: {otp}")
    print(f"🎯 Purpose: {purpose}")
    
    try:
        # Try FastAPI-Mail first
        if purpose == "verification":
            subject = "AITrade Verification Code"
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 2.5rem;">AITrade</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">AI-Powered Trading Platform</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
                    <h2 style="color: #1e293b; margin-bottom: 20px;">Email Verification</h2>
                    <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                        Thank you for registering with AITrade! To complete your registration, please enter the verification code below:
                    </p>
                    
                    <div style="background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                        <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 0.9rem;">VERIFICATION CODE</p>
                        <h1 style="color: #667eea; font-size: 2.5rem; letter-spacing: 8px; margin: 0; font-weight: bold;">{otp}</h1>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 0.85rem; margin: 20px 0;">
                        <strong>Important:</strong> This code will expire in 5 minutes for your security.
                    </p>
                </div>
                
                <div style="text-align: center; padding: 20px; background: #f1f5f9; border-radius: 10px;">
                    <p style="color: #6b7280; margin: 0; font-size: 0.85rem;">
                        If you didn't request this verification, please ignore this email.
                    </p>
                    <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 0.85rem;">
                        © 2024 AITrade. All rights reserved.
                    </p>
                </div>
            </body>
            </html>
            """
            # Plain text fallback
            plain_text = f"Your AITrade verification code is: {otp}. It expires in 5 minutes."
            
        else:  # password reset
            subject = "AITrade Password Reset Code"
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 2.5rem;">AITrade</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">AI-Powered Trading Platform</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
                    <h2 style="color: #1e293b; margin-bottom: 20px;">Password Reset Request</h2>
                    <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                        We received a request to reset your password. To proceed, please enter the verification code below:
                    </p>
                    
                    <div style="background: white; border: 2px dashed #ef4444; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                        <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 0.9rem;">RESET CODE</p>
                        <h1 style="color: #ef4444; font-size: 2.5rem; letter-spacing: 8px; margin: 0; font-weight: bold;">{otp}</h1>
                    </div>
                    
                    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                        <p style="color: #991b1b; margin: 0; font-size: 0.9rem;">
                            <strong>Security Notice:</strong> If you didn't request this password reset, please secure your account immediately.
                        </p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 0.85rem; margin: 20px 0;">
                        This code will expire in 5 minutes for your security.
                    </p>
                </div>
                
                <div style="text-align: center; padding: 20px; background: #f1f5f9; border-radius: 10px;">
                    <p style="color: #6b7280; margin: 0; font-size: 0.85rem;">
                        If you didn't request this reset, please ignore this email.
                    </p>
                    <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 0.85rem;">
                        © 2024 AITrade. All rights reserved.
                    </p>
                </div>
            </body>
            </html>
            """
            # Plain text fallback
            plain_text = f"Your AITrade password reset code is: {otp}. It expires in 5 minutes."
        
        message = MessageSchema(
            subject=subject,
            recipients=[email],
            html=html_content,
            subtype="html"
        )
        
        print(f"📤 Attempting to send email via {conf.MAIL_SERVER}...")
        print(f"🔧 SMTP Server: {conf.MAIL_SERVER}:{conf.MAIL_PORT}")
        print(f"👤 From: {conf.MAIL_FROM}")
        print(f"📬 To: {email}")
        
        await fm.send_message(message)
        print(f"✅ Email sent successfully to {email}")
        
    except Exception as e:
        print(f"❌ FastAPI-Mail failed: {str(e)}")
        print("🔄 Trying direct SMTP fallback...")
        
        # Fallback to direct SMTP
        try:
            await send_direct_smtp(email, otp, purpose)
        except Exception as e2:
            print(f"❌ Direct SMTP also failed: {str(e2)}")
            raise Exception(f"Failed to send OTP email: {str(e)}")

async def send_direct_smtp(email: EmailStr, otp: str, purpose: str):
    """Direct SMTP fallback"""
    
    # Determine which SMTP to use
    gmail_username = os.getenv("GMAIL_USERNAME")
    gmail_password = os.getenv("GMAIL_PASSWORD")
    
    if gmail_username and gmail_password:
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        username = gmail_username
        password = gmail_password
        from_email = gmail_username
    else:
        smtp_server = os.getenv("MAIL_SERVER")
        smtp_port = int(os.getenv("MAIL_PORT", 587))
        username = os.getenv("MAIL_USERNAME")
        password = os.getenv("MAIL_PASSWORD")
        from_email = os.getenv("MAIL_FROM")
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = email
    msg['Subject'] = f"AITrade {'Verification' if purpose == 'verification' else 'Password Reset'} Code"
    
    body = f"""
    <html>
    <body>
        <h2>AITrade {'Email Verification' if purpose == 'verification' else 'Password Reset'}</h2>
        <p>Your code is: <strong>{otp}</strong></p>
        <p>This code expires in 5 minutes.</p>
        <br>
        <p>Best regards,<br>AITrade Team</p>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))
    
    # Send email
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(username, password)
    server.send_message(msg)
    server.quit()
    
    print(f"✅ Direct SMTP email sent to {email}")
