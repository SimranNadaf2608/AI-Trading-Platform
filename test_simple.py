import requests
import json

# Test with a simple endpoint first
def test_simple_endpoint():
    print("🧪 Testing Simple Endpoint...")
    
    try:
        # Test root endpoint
        response = requests.get("http://localhost:8001/")
        print(f"Root endpoint Status: {response.status_code}")
        print(f"Root endpoint Response: {response.text}")
        
        # Test docs endpoint
        response = requests.get("http://localhost:8001/docs")
        print(f"Docs endpoint Status: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_simple_endpoint()
