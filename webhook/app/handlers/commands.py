import logging
from app.models import Application, Device
from database import db

logger = logging.getLogger(__name__)

def handle_installed_application_list(payload_dict, udid):
    try:
        # Extract the UDID from the payload (assuming it's in 'Device' or another appropriate key)
        device_udid = udid
        
        if not device_udid:
            logger.error("No device UDID found in the payload")
            return {"status": "error", "message": "No device UDID found"}

        # Check if the device already exists
        device = Device.query.filter_by(udid=device_udid).first()
        
        if not device:
            # Create the device if it doesn't exist
            device = Device(udid=device_udid)
            db.session.add(device)
            db.session.commit()
            logger.info(f"Created new device with UDID: {device_udid}")

        # Extract the list of applications
        apps = payload_dict.get('InstalledApplicationList', [])
        logger.info(f"apps: {apps}")

        # Process each application in the list
        app_names = []
        for app in apps:
            if 'Name' in app and 'Identifier' in app: 
                # Check if the application already exists in the database
                existing_app = Application.query.filter_by(bundle_id=app['Identifier']).first()
                
                if not existing_app:
                    # If the app doesn't exist, create a new Application
                    new_app = Application(name=app['Name'], bundle_id=app['Identifier'])
                    db.session.add(new_app)
                    db.session.commit()
                    logger.info(f"Created new application: {app['Name']} with Bundle ID: {app['Identifier']}")
                else:
                    new_app = existing_app  # If it exists, use the existing application
                
                # Establish the many-to-many relationship between Device and Application
                if new_app not in device.applications:
                    device.applications.append(new_app)

                app_names.append(app['Name'])  # Collect app names for logging
                
        # Commit changes to the database
        db.session.commit()

        # Log success and return the result
        logger.info(f"Extracted {len(app_names)} applications: {', '.join(app_names)}")
        return {"status": "success", "application_count": len(app_names), "applications": app_names}
    
    except Exception as e:
        logger.error(f"Error processing InstalledApplicationList: {e}")
        return {"status": "error", "message": "Failed to process InstalledApplicationList"}


def handle_default(command_type):
    logger.warning(f"Unknown command type: {command_type}")
    return {"status": "error", "message": f"Unknown command type: {command_type}"}
