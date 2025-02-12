from extensions import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(225), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False, default="hiker")
    registered_on = db.Column(db.DateTime, default = datetime.utcnow())
    
    def __repr__(self):
        return f"<User {self.email}, Role {self.role}>"

class Subscriber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    def __repr__(self):
        return f"<Subscriber {self.email}>"
    
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    visited = db.Column(db.String(225), nullable=False)
    number = db.Column(db.String(15), nullable=False)
    message = db.Column(db.Text(225), nullable=False)
    
    def __repr__(self):
        return f"<Feedback {self.name}>"
 
class Question(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    question = db.Column(db.String(225), nullable=False)
    email = db.Column(db.String(100), nullable=False) 
    
    def __repr__(self):
        return f"<Question {self.question}>"   
    
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), nullable= False)
    email = db.Column(db.String(100), nullable = False)
    phone = db.Column(db.String(15), nullable= False)
    subject = db.Column(db.String(150), nullable = False)
    message = db.Column(db.Text, nullable = False)
    
    def __repr__(self):
        return f"<Contact {self.name}>"