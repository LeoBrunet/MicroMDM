import httpx
import jwt  # PyJWT pour générer le token
from time import time

# Configuration
KEY_ID = "ZZBUZH97W5"  # Apple Developer Key ID
TEAM_ID = "6ZPTX2TZ23"  # Apple Developer Team ID
BUNDLE_ID = "com.pradeo.public.agent"  # Your app's bundle ID
PRIVATE_KEY_PATH = "./AuthKey_ZZBUZH97W5.p8"  # Path to your private key
DEVICE_TOKEN = "4dd1e7d627802122610261aad425c257e61bf0701aa300d0390259620420c5ae"  # Device token (received from the device)

# Generate JWT for APNs
def generate_jwt():
    with open(PRIVATE_KEY_PATH, "r") as f:
        private_key = f.read()
    headers = {
        "alg": "ES256",
        "kid": KEY_ID
    }
    payload = {
        "iss": TEAM_ID,
        "iat": int(time())  # Current time
    }
    return jwt.encode(payload, private_key, algorithm="ES256", headers=headers)

# Send push notification
def send_push_notification():
    url = f"https://api.sandbox.push.apple.com/3/device/{DEVICE_TOKEN}"  # Use "push" instead of "sandbox" for production
    headers = {
        "apns-topic": BUNDLE_ID,  # App bundle identifier
        "authorization": f"bearer {generate_jwt()}"  # Authorization with JWT token
    }
    payload = {
        "type": "mdm",  # Identifies the notification type as MDM (Mobile Device Management)
        "aps": {
            "alert": {
                "title": "Hello Léo!",  # Title of the notification
                "body": "This is a test notification with content 😊."  # Body of the notification
            },
            "badge": 1,  # Badge number on app icon
            "sound": "default"  # Notification sound
        },
        "udid": "00008101-0001214A1AB9001E",  # Custom data for your application
        #"mdm_id": "unique-id-123456",  # Add a unique identifier for your MDM notification
        #"device_token": DEVICE_TOKEN  # Include the device token to reference the target device
    }


    # Sending the request using httpx
    with httpx.Client(http2=True) as client:
        response = client.post(url, headers=headers, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")

# Execute the function to send the notification
send_push_notification()
