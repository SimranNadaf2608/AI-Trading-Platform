import requests
import json

# Test the fixed frontend data structure
def test_frontend_fix():
    print("🧪 Testing Frontend Fix...")
    
    # This is what the frontend should now send
    frontend_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe.test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    }
    
    try:
        print(f"\n📤 Sending frontend-style data to: {frontend_data['email']}")
        response = requests.post(
            "http://localhost:8001/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=frontend_data
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Frontend fix successful!")
            print("🔍 Check Supabase for OTP record")
            print("📧 Check email for OTP delivery")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_frontend_fix()
