import requests
import json

# Test complete signup flow
def test_complete_signup():
    print("🧪 Testing Complete Signup Flow...")
    
    # Step 1: Send OTP
    print("\n1️⃣ Sending OTP...")
    signup_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    }
    
    response = requests.post(
        "http://localhost:8003/auth/send-otp",
        headers={"Content-Type": "application/json"},
        json=signup_data
    )
    
    if response.status_code == 200:
        result = response.json()
        otp = result.get('otp')
        print(f"✅ OTP sent: {otp}")
        
        # Step 2: Verify OTP
        print("\n2️⃣ Verifying OTP...")
        verify_data = {
            "email": "test@example.com",
            "otp": otp
        }
        
        verify_response = requests.post(
            "http://localhost:8003/auth/verify-otp",
            headers={"Content-Type": "application/json"},
            json=verify_data
        )
        
        if verify_response.status_code == 200:
            print(f"✅ OTP verified! Response: {verify_response.text}")
        else:
            print(f"❌ OTP verification failed: {verify_response.text}")
    else:
        print(f"❌ OTP send failed: {response.text}")

if __name__ == "__main__":
    test_complete_signup()
