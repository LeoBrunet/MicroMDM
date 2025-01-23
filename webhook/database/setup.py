from app import create_app
from database import db

# Create the Flask app instance
app = create_app()

with app.app_context():
    db.create_all()  # Create all tables defined in the models
    print("Database tables created.")
