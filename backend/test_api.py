import json
import urllib.request

req = urllib.request.Request(
    'http://localhost:8000/auth/send-otp',
    data=json.dumps({
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'test2@example.com',
        'password': 'password123',
        'confirm_password': 'password123'
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    urllib.request.urlopen(req)
    with open('result.txt', 'w') as f:
        f.write("Success!")
except Exception as e:
    with open('result.txt', 'w') as f:
        f.write(e.read().decode('utf-8'))
