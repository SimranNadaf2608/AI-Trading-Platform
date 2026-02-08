import requests
import json

# Test OTP generation with fresh email
def test_otp_generation():
    print("🧪 Testing OTP Generation...")
    
    test_data = {
        "first_name": "OTP",
        "last_name": "Test",
        "email": "otp.test.2024@yahoo.com",  # Fresh email
        "password": "password123",
        "confirm_password": "password123"
    }
    
    try:
        print(f"\n📤 Sending OTP request to: {test_data['email']}")
        response = requests.post(
            "http://localhost:8001/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Check console logs for OTP generation details")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_otp_generation()
