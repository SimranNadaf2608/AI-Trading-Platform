#!/usr/bin/env python3
"""
Test email delivery with different services
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def test_brevo_smtp():
    """Test Brevo SMTP connection"""
    print("🔍 Testing Brevo SMTP...")
    
    try:
        # Brevo configuration
        smtp_server = "smtp-relay.brevo.com"
        smtp_port = 587
        username = os.getenv("MAIL_USERNAME")
        password = os.getenv("MAIL_PASSWORD")
        from_email = os.getenv("MAIL_FROM")
        to_email = "simrannadaf2608@gmail.com"
        
        print(f"📧 Server: {smtp_server}:{smtp_port}")
        print(f"👤 Username: {username}")
        print(f"📬 From: {from_email}")
        print(f"📬 To: {to_email}")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = "Test Email from AITrade - Brevo SMTP"
        
        body = """
        <html>
        <body>
            <h2>Test Email from AITrade</h2>
            <p>This is a test email to verify Brevo SMTP delivery.</p>
            <p>If you receive this email, the SMTP configuration is working correctly.</p>
            <p>Time sent: {time}</p>
            <br>
            <p>Best regards,<br>AITrade Team</p>
        </body>
        </html>
        """.format(time="2026-02-10 10:08:00")
        
        msg.attach(MIMEText(body, 'html'))
        
        # Connect to SMTP server
        print("🔌 Connecting to SMTP server...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        
        print("🔐 Logging in...")
        server.login(username, password)
        
        print("📤 Sending email...")
        server.send_message(msg)
        server.quit()
        
        print("✅ Brevo SMTP test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Brevo SMTP test failed: {str(e)}")
        return False

def test_gmail_smtp():
    """Test Gmail SMTP as alternative"""
    print("\n🔍 Testing Gmail SMTP (if configured)...")
    
    try:
        # Gmail configuration (if available)
        gmail_username = os.getenv("GMAIL_USERNAME")
        gmail_password = os.getenv("GMAIL_PASSWORD")
        
        if not gmail_username or not gmail_password:
            print("⚠️ Gmail credentials not found in .env file")
            return False
            
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        from_email = gmail_username
        to_email = "simrannadaf2608@gmail.com"
        
        print(f"📧 Server: {smtp_server}:{smtp_port}")
        print(f"👤 Username: {gmail_username}")
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = "Test Email from AITrade - Gmail SMTP"
        
        body = """
        <html>
        <body>
            <h2>Test Email from AITrade</h2>
            <p>This is a test email to verify Gmail SMTP delivery.</p>
            <p>If you receive this email, the Gmail SMTP configuration is working.</p>
            <p>Time sent: {time}</p>
            <br>
            <p>Best regards,<br>AITrade Team</p>
        </body>
        </html>
        """.format(time="2026-02-10 10:08:00")
        
        msg.attach(MIMEText(body, 'html'))
        
        # Connect to SMTP server
        print("🔌 Connecting to Gmail SMTP...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        
        print("🔐 Logging in...")
        server.login(gmail_username, gmail_password)
        
        print("📤 Sending email...")
        server.send_message(msg)
        server.quit()
        
        print("✅ Gmail SMTP test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Gmail SMTP test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting email delivery tests...")
    print("=" * 50)
    
    # Test Brevo
    brevo_success = test_brevo_smtp()
    
    # Test Gmail
    gmail_success = test_gmail_smtp()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"Brevo SMTP: {'✅ Working' if brevo_success else '❌ Failed'}")
    print(f"Gmail SMTP: {'✅ Working' if gmail_success else '❌ Failed'}")
    
    if not brevo_success and not gmail_success:
        print("\n🔧 Suggestions:")
        print("1. Check Brevo account - verify SMTP credentials are valid")
        print("2. Check Brevo sending limits - may have reached daily limit")
        print("3. Check if email domain is verified in Brevo")
        print("4. Try Gmail SMTP as alternative")
        print("5. Check spam/junk folders")
