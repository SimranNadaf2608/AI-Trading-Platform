import requests
import json

# Test and then check database
def test_otp_db_check():
    print("🧪 Testing OTP and checking if it's generated...")
    
    test_data = {
        "first_name": "DB",
        "last_name": "Test",
        "email": "db.test.2024@gmail.com",  # Fresh email
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
            print("✅ OTP request successful")
            print("🔍 Check Supabase database for OTP record:")
            print(f"   - Table: otp_codes")
            print(f"   - Email: {test_data['email']}")
            print(f"   - Look for recent OTP entry")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_otp_db_check()
