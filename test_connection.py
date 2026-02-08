import requests

# Test frontend-backend connection
def test_connection():
    print("🧪 Testing Frontend-Backend Connection...")
    
    try:
        # Test if backend is responding
        response = requests.get("http://localhost:8001/")
        print(f"✅ Backend Status: {response.status_code}")
        
        # Test OTP endpoint with correct data structure
        test_data = {
            "first_name": "Test",
            "last_name": "User",
            "email": "test@example.com",
            "password": "password123",
            "confirm_password": "password123"
        }
        
        response = requests.post(
            "http://localhost:8001/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"✅ OTP Endpoint Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Frontend-Backend Connection: YES")
            print("✅ Data Structure: Compatible")
            print("✅ API: Working")
        else:
            print("❌ Frontend-Backend Connection: NO")
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Frontend-Backend Connection: NO")
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_connection()
