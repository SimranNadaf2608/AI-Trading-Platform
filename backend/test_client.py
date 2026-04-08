from fastapi.testclient import TestClient
from auth_main import app

client = TestClient(app)

response = client.post(
    "/auth/send-otp",
    json={
        "first_name": "Test",
        "last_name": "User",
        "email": "testclient@example.com",
        "password": "password123",
        "confirm_password": "password123"
    }
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
