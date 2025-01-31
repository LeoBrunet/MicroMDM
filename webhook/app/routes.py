from flask import Blueprint, request
from app.handlers.commands import handle_installed_application_list, handle_default
from app.handlers.utils import decode_base64, parse_plist
import logging

main_blueprint = Blueprint('main', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@main_blueprint.route('/', methods=['GET'])
def hello():
    logger.info("Hello, world!")
    return 'Hello, world!'

@main_blueprint.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json(silent=True)
    if not data or 'acknowledge_event' not in data or 'raw_payload' not in data['acknowledge_event']:
        logger.error("Invalid JSON structure or missing fields")
        logger.info(f"data: {data}")
        return {"status": "error", "message": "Invalid JSON structure or missing fields"}, 400

    raw_payload = data['acknowledge_event']['raw_payload']
    udid = data['acknowledge_event']['udid']
    try:
        decoded_payload = decode_base64(raw_payload)
        payload_dict = parse_plist(decoded_payload)
        logger.info(f"PAYLOAD: {payload_dict}")
    except Exception as e:
        logger.error(f"Error processing payload: {e}")
        return {"status": "error", "message": str(e)}, 400

    # Handle commands
    command_type = 'InstalledApplicationList' if 'InstalledApplicationList' in payload_dict else None
    command_handlers = {
        "InstalledApplicationList": lambda: handle_installed_application_list(payload_dict,udid),
    }

    if command_type:
        response = command_handlers.get(command_type, lambda: handle_default(command_type))()
    else:
        response = {"status": "success", "message": "No action required for the given payload"}

    return response
