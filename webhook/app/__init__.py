from flask import Flask
from database import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize database
    db.init_app(app)

    # Register routes
    with app.app_context():
        from app.routes import main_blueprint
        app.register_blueprint(main_blueprint)

    return app
