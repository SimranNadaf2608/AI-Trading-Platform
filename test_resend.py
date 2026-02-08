import requests
import json
import time

# Test resend functionality
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
        "http://localhost:8001/auth/send-otp",
        headers={"Content-Type": "application/json"},
        json=test_data
    )
    
    print(f"Status: {response1.status_code}")
    print(f"Response: {response1.text}")
    
    if response1.status_code == 200:
        result1 = response1.json()
        print(f"✅ First OTP sent: {result1.get('message')}")
        
        # Immediate second request (should be blocked)
        print("\n2️⃣ Sending second OTP immediately (should be blocked)...")
        response2 = requests.post(
            "http://localhost:8001/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"Status: {response2.status_code}")
        print(f"Response: {response2.text}")
        
        if response2.status_code == 200:
            result2 = response2.json()
            if "already sent" in result2.get('message', '').lower():
                print("✅ Resend cooldown working - blocked immediate resend")
            else:
                print("❌ Resend cooldown not working")
        else:
            print(f"❌ Unexpected error: {response2.text}")
        
        # Wait for cooldown and try again
        print("\n3️⃣ Waiting 65 seconds for cooldown...")
        time.sleep(65)
        
        print("4️⃣ Sending OTP after cooldown (should work)...")
        response3 = requests.post(
            "http://localhost:8001/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"Status: {response3.status_code}")
        print(f"Response: {response3.text}")
        
        if response3.status_code == 200:
            result3 = response3.json()
            print(f"✅ Resend after cooldown works: {result3.get('message')}")
        else:
            print(f"❌ Resend after cooldown failed: {response3.text}")
    else:
        print(f"❌ First OTP failed: {response1.text}")

if __name__ == "__main__":
    test_resend_otp()
