import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def test_brevo_smtp():
    """Test Brevo SMTP connection"""
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = os.getenv("MAIL_USERNAME")
        msg['To'] = "test@example.com"
        msg['Subject'] = "Test Email from AITrade"
        
        # Simple text content
        body = "This is a test email from AITrade authentication system."
        msg.attach(MIMEText(body, 'plain'))
        
        # SMTP server configuration
        smtp_server = os.getenv("MAIL_SERVER")
        smtp_port = int(os.getenv("MAIL_PORT"))
        smtp_username = os.getenv("MAIL_USERNAME")
        smtp_password = os.getenv("MAIL_PASSWORD")
        
        print(f"Connecting to Brevo SMTP: {smtp_server}:{smtp_port}")
        print(f"Username: {smtp_username}")
        print(f"Password: {'*' * len(smtp_password) if smtp_password else 'None'}")
        
        # Create SMTP session with explicit SSL/TLS
        server = smtplib.SMTP(smtp_server, smtp_port)
        
        # Enable security
        server.starttls()
        
        # Login with app password
        server.login(smtp_username, smtp_password)
        
        # Send email
        text = msg.as_string()
        server.sendmail(smtp_username, "test@example.com", text)
        server.quit()
        
        print("✅ Email sent successfully via Brevo!")
        return True
        
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        print(f"Error type: {type(e).__name__}")
        
        # Check for specific Brevo errors
        if "not yet activated" in str(e):
            print("🔧 SOLUTION: Contact Brevo support at contact@sendinblue.com")
            print("🔧 Request SMTP activation for your account")
        elif "authentication failed" in str(e).lower():
            print("🔧 SOLUTION: Check your Brevo credentials")
            print("🔧 Verify username and password are correct")
        
        return False

if __name__ == "__main__":
    test_brevo_smtp()
