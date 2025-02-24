from extensions import db
from datetime import datetime


class ChatRequests(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hiker_id = db.Column(db.String(10), db.ForeignKey("user.hiker_id"), nullable=False)
    guide_id = db.Column(db.String(10), db.ForeignKey("user.guide_id"), nullable=False)
    status = db.Column(
        db.Enum("pending", "accepted", "rejected", name="chat_status"),
        default="pending",
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    hiker = db.relationship("User", foreign_keys=[hiker_id], backref="hiker_requests")
    guide = db.relationship("User", foreign_keys=[guide_id], backref="guide_requests")

    def __init__(self, hiker_id, guide_id, status="pending"):
        self.hiker_id = hiker_id
        self.guide_id = guide_id
        self.status = status

    def to_dict(self):
        return {
            "id": self.id,
            "hiker_id": self.hiker_id,
            "guide_id": self.guide_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }

class ChatResponses(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hiker_id = db.Column(db.String(50), db.ForeignKey("user.hiker_id"), nullable=False)
    guide_id = db.Column(db.String(50), db.ForeignKey("user.guide_id"), nullable=False)
    accepted = db.Column(db.Boolean, nullable=False)
    guide_whatsapp = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notified = db.Column(db.Boolean, default=False)
    hiker = db.relationship("User", foreign_keys=[hiker_id], backref="hiker_responses")
    guide = db.relationship("User", foreign_keys=[guide_id], backref="guide_responses")
    
    def __repr__(self, hiker_id, guide_id, status):
        self.hiker_id = hiker_id
        self.guide_id = guide_id
        self.status = status

    def to_dict(self):
        return {
            "id": self.id,
            "hiker_id": self.hiker_id,
            "guide_id": self.guide_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(225), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False, default="hiker")
    guide_id = db.Column(db.String(10), index=True, nullable=True, unique=True)
    hiker_id = db.Column(db.String(10), index=True, nullable=True, unique=True)
    registered_on = db.Column(db.DateTime, default=datetime.utcnow())
    last_seen = db.Column(db.String(50), nullable=True)

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
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(225), nullable=False)
    email = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Question {self.question}>"


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    subject = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Contact {self.name}>"


class GuideDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    guide_id = db.Column(
        db.String(10),
        db.ForeignKey("user.guide_id", ondelete="CASCADE"),
        nullable=False,
    )
    guide_city = db.Column(db.String(100), nullable=False)
    guide_district = db.Column(db.String(100), nullable=False)
    guide_state = db.Column(db.String(100), nullable=False)
    guide_phone = db.Column(db.String(20), nullable=False)
    guide_whatsapp = db.Column(db.String(20), nullable=False)
    guide_experience = db.Column(db.Text, nullable=False)
    guide_languages = db.Column(db.Text, nullable=False)
    guide_speciality = db.Column(db.Text, nullable=False)
    guide_photo = db.Column(db.String(255))

    user = db.relationship("User", backref="guide_details", uselist=False)

    def __repr__(self):
        return f"<Guide_Details {self.guide_id}, City {self.guide_city}>"
    
class HikerRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hiker_id = db.Column(db.String(50), nullable=False)
    hiker_username = db.Column(db.String(100), nullable=False)
    trek_place = db.Column(db.String(255), nullable=False)
    on_date = db.Column(db.Date, nullable=False)
    on_time = db.Column(db.Time, nullable=False)
    all_members = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, hiker_id, hiker_username, trek_place, on_date, on_time, all_members):
        self.hiker_id = hiker_id
        self.hiker_username = hiker_username
        self.trek_place = trek_place
        self.on_date = on_date
        self.on_time = on_time
        self.all_members = all_members