import logging
import base64
from flask import Flask, request
import plistlib

app = Flask(__name__)
app.config['DEBUG'] = True

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Command Handlers
def handle_installed_application_list(payload_dict):
    """Handles the InstalledApplicationList command."""
    try:
        # Extract the list of applications directly from the payload
        apps = payload_dict.get('InstalledApplicationList', [])
        logger.info(f"apps: {apps}")
        app_names = []

        # Iterate over each application entry
        for app in apps:
            # Extract the application name if available
            if 'Name' in app:
                app_names.append(app['Name'])

        logger.info(f"Extracted {len(app_names)} applications.")
        logger.info(f"Applications: {', '.join(app_names)}")

        return {"status": "success", "message": "InstalledApplicationList handled", "application_count": len(app_names), "applications": app_names}
    except Exception as e:
        logger.error(f"Error processing InstalledApplicationList: {e}")
        return {"status": "error", "message": "Error processing InstalledApplicationList"}

def handle_default(command_type):
    """Handles unknown commands."""
    logger.warning(f"Unknown command type: {command_type}")
    return {"status": "error", "message": f"Unknown command type: {command_type}"}

@app.route('/', methods=['GET'])
def hello():
    logger.info("Hello, world!")
    return 'Hello, world!'

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json(silent=True)
    if not data or 'acknowledge_event' not in data or 'raw_payload' not in data['acknowledge_event']:
        logger.error("Invalid JSON structure or missing fields")
        return {"status": "error", "message": "Invalid JSON structure or missing fields"}, 400

    raw_payload = data['acknowledge_event']['raw_payload']
    
    try:
        decoded_payload = base64.b64decode(raw_payload)
    except Exception as e:
        logger.error(f"Error decoding Base64 payload: {e}")
        return {"status": "error", "message": "Invalid Base64 payload"}, 400

    try:
        payload_dict = plistlib.loads(decoded_payload)
        logger.info(f"Parsed payload: {payload_dict}")
    except Exception as e:
        logger.error(f"Error parsing payload: {e}")
        return {"status": "error", "message": "Invalid payload"}, 400

    # Extract CommandType - in this case, check if "InstalledApplicationList" exists
    if 'InstalledApplicationList' in payload_dict:
        command_type = 'InstalledApplicationList'
    else:
        command_type = None

    if command_type:
        logger.info(f"CommandType: {command_type}")
    else:
        logger.info("No CommandType found in the payload.")

    # Map command types to handlers
    command_type_map = {
        "InstalledApplicationList": lambda: handle_installed_application_list(payload_dict),
    }

    # Execute the corresponding handler if command type exists
    if command_type:
        response = command_type_map.get(command_type, lambda: handle_default(command_type))()
    else:
        response = {"status": "success", "message": "No action required for the given payload"}

    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)