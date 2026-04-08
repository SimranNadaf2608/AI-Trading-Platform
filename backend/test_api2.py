import sys
import urllib.request
import urllib.error
import json

req = urllib.request.Request(
    'http://localhost:8000/auth/send-otp',
    data=json.dumps({
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'test66@example.com',
        'password': 'password123',
        'confirm_password': 'password123'
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    response = urllib.request.urlopen(req)
    with open('result.txt', 'w') as f:
        f.write(f"STATUS {response.status}: " + response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    with open('result.txt', 'w') as f:
        f.write(f"STATUS {e.code}:\nHeaders: {e.headers}\nBody: {e.read().decode('utf-8')}")
except Exception as e:
    with open('result.txt', 'w') as f:
        f.write("Exception: " + str(e))
