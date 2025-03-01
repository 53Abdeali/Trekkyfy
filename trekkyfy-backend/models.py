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
    guide_id = db.Column(db.String(50), nullable=False)
    hiker_username = db.Column(db.String(100), nullable=False)
    trek_place = db.Column(db.String(255), nullable=False)
    trek_date = db.Column(db.Date, nullable=False)
    trek_time = db.Column(db.Time, nullable=False)
    hiking_members = db.Column(db.Integer, nullable=False)
    status = db.Column(
        db.Enum("pending", "accepted", "rejected", name="chat_status"),
        default="pending",
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Hiker_Details {self.hiker_id}, Username {self.hiker_username}>"


class PriavlGuideResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hiker_id = db.Column(db.String(50), nullable=False)
    guide_id = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    availability = db.Column(db.String(20), nullable=False)
    partialTime = db.Column(db.String(50), nullable=True)
    unavailableOption = db.Column(db.String(50), nullable=True)
    unavailabilityReason = db.Column(db.String(200), nullable=True)
    accepted = db.Column(db.Boolean, nullable=True)
    notified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<Guide_Response {self.price}, Username {self.availability}>"


class Hiker(db.Model):
    __tablename__ = "hikers"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hiker_id = db.Column(db.String(15), nullable=False, index=True)
    hiker_username = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    whatsapp = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    current_location = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    trek_date = db.Column(db.Date, nullable=False)
    trek_time = db.Column(db.Time, nullable=False)
    members = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(
        self,
        hiker_id,
        hiker_username,
        phone,
        whatsapp,
        email,
        current_location,
        city,
        state,
        trek_date,
        trek_time,
        members,
    ):
        self.hiker_id = hiker_id
        self.hiker_username = hiker_username
        self.phone = phone
        self.whatsapp = whatsapp
        self.email = email
        self.current_location = current_location
        self.city = city
        self.state = state
        self.trek_date = trek_date
        self.trek_time = trek_time
        self.members = members

    def to_dict(self):
        return {
            "hiker_id": self.hiker_id,
            "hikername": self.hikername,
            "phone": self.phone,
            "whatsapp": self.whatsapp,
            "email": self.email,
            "current_location": self.current_location,
            "city": self.city,
            "state": self.state,
            "trek_date": self.trek_date.strftime("%Y-%m-%d"),
            "trek_time": self.trek_time.strftime("%H:%M"),
            "members": self.members,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }


class HikerMember(db.Model):
    __tablename__ = "hiker_members"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hiker_id = db.Column(
        db.String(15), db.ForeignKey("hikers.hiker_id"), nullable=False
    )
    email = db.Column(db.String(100), nullable=False)
    whatsapp = db.Column(db.String(15), nullable=False)

    hikers = db.relationship("Hiker", backref="hikers", uselist=False)

    def __init__(self, hiker_id, email, whatsapp):
        self.hiker_id = hiker_id
        self.email = email
        self.whatsapp = whatsapp

    def to_dict(self):
        return {
            "id": self.id,
            "hiker_id": self.hiker_id,
            "email": self.email,
            "whatsapp": self.whatsapp,
        }


class Booking(db.Model):
    __tablename__ = "bookings"
    id = db.Column(db.Integer, primary_key=True)
    hiker_id = db.Column(db.String(50), nullable=False)
    trek_id = db.Column(db.Integer, nullable=False)
    guide_id = db.Column(db.String(50), nullable=False)
    details = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
