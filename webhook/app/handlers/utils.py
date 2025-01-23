import base64
import plistlib

def decode_base64(raw_payload):
    return base64.b64decode(raw_payload)

def parse_plist(decoded_payload):
    return plistlib.loads(decoded_payload)
