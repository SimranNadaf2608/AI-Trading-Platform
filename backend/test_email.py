import requests
import json

# Test the OTP sending endpoint
url = "http://localhost:8001/auth/send-otp"
data = {"email": "test@example.com"}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
