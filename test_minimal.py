import requests
import json

# Test data
test_data = {
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123",
    "confirm_password": "password123"
}

try:
    response = requests.post(
        "http://localhost:8003/auth/send-otp",
        headers={"Content-Type": "application/json"},
        json=test_data
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        response_json = response.json()
        print(f"Success! OTP: {response_json.get('otp')}")
    else:
        print(f"Error! Status: {response.status_code}")
        
except Exception as e:
    print(f"Request failed: {e}")
