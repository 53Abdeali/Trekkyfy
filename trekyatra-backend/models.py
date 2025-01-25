from extensions import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80),unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(225), unique=True, nullable=False)
    registered_on = db.Column(db.DateTime, default = datetime.utcnow())
    
    def __repr__(self):
        return f"<User {self.email}>"