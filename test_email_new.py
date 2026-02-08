import requests
import json

# Test with different email to bypass cooldown
def test_email_new():
    print("🧪 Testing Email with New Email Address...")
    
    test_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test.new.2024@example.com",  # Different email
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
            print("✅ Check console logs for email sending details")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_email_new()
