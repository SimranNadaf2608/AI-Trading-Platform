import requests

# Simple test
try:
    response = requests.get("http://localhost:8001/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
