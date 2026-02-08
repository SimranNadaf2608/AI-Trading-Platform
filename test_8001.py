import requests
import json

# Test only port 8001
def test_port_8001():
    print("🧪 Testing Backend on Port 8001 ONLY...")
    
    test_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    }
    
    try:
        print("\n📤 Sending OTP to port 8001...")
        response = requests.post(
            "http://localhost:8001/auth/send-otp",
            headers={"Content-Type": "application/json"},
            json=test_data
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Backend on port 8001 is working!")
        else:
            print(f"❌ Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_port_8001()
