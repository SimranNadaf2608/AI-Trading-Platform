# Test Brevo email configuration directly
import os
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

load_dotenv()

# Test email configuration
print("🔧 Testing Brevo Email Configuration...")
print(f"MAIL_USERNAME: {os.getenv('MAIL_USERNAME')}")
print(f"MAIL_PASSWORD: {os.getenv('MAIL_PASSWORD')[:20]}...")
print(f"MAIL_FROM: {os.getenv('MAIL_FROM')}")
print(f"MAIL_SERVER: {os.getenv('MAIL_SERVER')}")
print(f"MAIL_PORT: {os.getenv('MAIL_PORT')}")

# Test connection
try:
    conf = ConnectionConfig(
        MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
        MAIL_FROM=os.getenv("MAIL_FROM"),
        MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
        MAIL_SERVER=os.getenv("MAIL_SERVER"),
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=False,
        TIMEOUT=30
    )
    
    fm = FastMail(conf)
    print("✅ Email configuration loaded successfully")
    
    # Test message
    message = MessageSchema(
        subject="Test Email from AITrade",
        recipients=["simrannadaf2608@gmail.com"],
        html="<h1>Test Email</h1><p>This is a test email from AITrade.</p>",
        subtype="html"
    )
    
    print("📤 Attempting to send test email...")
    
    import asyncio
    async def send_test():
        await fm.send_message(message)
        print("✅ Test email sent successfully!")
    
    asyncio.run(send_test())
    
except Exception as e:
    print(f"❌ Email configuration error: {e}")
    print(f"Error type: {type(e).__name__}")
