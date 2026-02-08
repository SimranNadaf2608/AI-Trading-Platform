import requests
import json

# Test email OTP sending
test_data = {
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123",
    "confirm_password": "password123"
}

try:
    print("🧪 Testing OTP email sending...")
    response = requests.post(
        "http://localhost:8001/auth/send-otp",
        headers={"Content-Type": "application/json"},
        json=test_data
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Backend is running and responding!")
    else:
        print(f"❌ Error: {response.status_code}")
        
except Exception as e:
    print(f"❌ Request failed: {e}")
