from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False,  # For testing only
    TIMEOUT=30
)

fm = FastMail(conf)


async def send_otp_email(email: EmailStr, otp: str, purpose: str = "verification"):
    """Send OTP email to user"""

    print(f"📧 Sending OTP email to: {email}")
    print(f"🔢 OTP Code: {otp}")
    print(f"🎯 Purpose: {purpose}")

    try:
        if purpose == "verification":
            subject = "AITrade Verification Code"
            plain_text = f"Your AITrade verification code is: {otp}. It expires in 5 minutes."

            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="letter-spacing:6px;">{otp}</h1>
                <p>This code expires in 5 minutes.</p>
            </body>
            </html>
            """

        else:  # password reset
            subject = "AITrade Password Reset Code"
            plain_text = f"Your AITrade password reset code is: {otp}. It expires in 5 minutes."

            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Password Reset</h2>
                <p>Your reset code is:</p>
                <h1 style="letter-spacing:6px;">{otp}</h1>
                <p>This code expires in 5 minutes.</p>
            </body>
            </html>
            """

        # ✅ Always create message here (outside if/else)
        message = MessageSchema(
            subject=subject,
            recipients=[email],
            body=plain_text,
            html=html_content,
            subtype="html"
        )

        print(f"📤 Attempting to send email via Brevo SMTP...")
        print(f"🔧 SMTP Server: {conf.MAIL_SERVER}:{conf.MAIL_PORT}")
        print(f"👤 From: {conf.MAIL_FROM}")
        print(f"📬 To: {email}")

        await fm.send_message(message)
        print(f"✅ Email sent successfully to {email}")

    except Exception as e:
        print(f"❌ Email sending failed: {str(e)}")
        print(f"🔍 Error Type: {type(e).__name__}")
        print(f"📊 SMTP Config: {conf.MAIL_SERVER}:{conf.MAIL_PORT}")
        raise Exception(f"Failed to send OTP email: {str(e)}")
