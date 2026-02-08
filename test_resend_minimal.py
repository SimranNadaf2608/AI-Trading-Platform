import requests
import json
import time

# Test resend functionality with minimal server
def test_resend_otp():
    print("🧪 Testing OTP Resend Functionality...")
    
    test_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    }
    
    # First OTP request
    print("\n1️⃣ Sending first OTP...")
    response1 = requests.post(
        "http://localhost:8003/auth/send-otp",
        headers={"Content-Type": "application/json"},
        json=test_data
    )
    
    print(f"Status: {response1.status_code}")
    print(f"Response: {response1.text}")
    
    if response1.status_code == 200:
        result1 = response1.json()
        print(f"✅ First OTP sent: {result1.get('message')}")
        
        # Immediate second request (should work in minimal server)
        print("\n2️⃣ Sending second OTP immediately...")
        response2 = requests.post(
            "http://localhost:8003/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"Status: {response2.status_code}")
        print(f"Response: {response2.text}")
        
        if response2.status_code == 200:
            result2 = response2.json()
            print(f"✅ Second OTP sent: {result2.get('message')}")
            print("📝 Note: Minimal server doesn't implement resend cooldown")
        else:
            print(f"❌ Second OTP failed: {response2.text}")
    else:
        print(f"❌ First OTP failed: {response1.text}")

if __name__ == "__main__":
    test_resend_otp()
