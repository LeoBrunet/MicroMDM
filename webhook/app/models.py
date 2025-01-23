from database import db

# Association table for many-to-many relationship
device_application = db.Table(
    'device_application',
    db.Column('device_id', db.Integer, db.ForeignKey('devices.id'), primary_key=True),
    db.Column('application_id', db.Integer, db.ForeignKey('applications.id'), primary_key=True)
)

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    bundle_id = db.Column(db.String(255), nullable=False, unique=True)  # Unique identifier for apps

    # Many-to-many relationship with Device
    devices = db.relationship(
        'Device',
        secondary=device_application,
        back_populates='applications'
    )

    def __repr__(self):
        return f"<Application(id={self.id}, name='{self.name}', bundle_id='{self.bundle_id}')>"


class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    udid = db.Column(db.String(255), nullable=False, unique=True)  # Unique identifier for devices

    # Many-to-many relationship with Application
    applications = db.relationship(
        'Application',
        secondary=device_application,
        back_populates='devices'
    )

    def __repr__(self):
        return f"<Device(id={self.id}, udid='{self.udid}')>"
