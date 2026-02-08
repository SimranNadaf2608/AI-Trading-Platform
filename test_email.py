import requests
import json

# Test email delivery with real email
def test_email_delivery():
    print("🧪 Testing Email Delivery...")
    
    test_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "simrannadaf2608@gmail.com",  # Use your real email
        "password": "password123",
        "confirm_password": "password123"
    }
    
    try:
        print(f"\n📤 Sending OTP to: {test_data['email']}")
        response = requests.post(
            "http://localhost:8001/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Request successful - Check console logs for email sending details")
            print("📧 Check your email inbox (and spam folder)")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_email_delivery()
