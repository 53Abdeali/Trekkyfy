from datetime import datetime
from flask import Blueprint, request, jsonify
from models import User
from extensions import db, bcrypt, mail
from flask_mail import Message  # type: ignore
import random
import string

reg_bp = Blueprint("register", __name__)


def generate_unique_guide_id():
    """Generate a unique 8-character Guide ID starting with 'G'."""
    while True:
        letters = random.choices(string.ascii_letters, k=4)
        digits = random.choices(string.digits, k=4)
        guide_id = "G" + "".join(random.sample(letters + digits, 8))
        if not User.query.filter_by(guide_id=guide_id).first():
            return guide_id


def generate_unique_hiker_id():
    """Generate a unique 8-character Hiker ID starting with 'H'."""
    while True:
        letters = random.choices(string.ascii_letters, k=4)
        digits = random.choices(string.digits, k=4)
        hiker_id = "H" + "".join(random.sample(letters + digits, 8))
        if not User.query.filter_by(hiker_id=hiker_id).first():
            return hiker_id


def send_guide_details_email(email, guide_id):
    """Send guide registration email with profile completion link."""
    try:
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Complete Your Guide Profile - Trekkyfy</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    padding: 20px;
                }}
                .container {{
                    max-width: 600px;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .button {{
                    display: inline-block;
                    padding: 10px 20px;
                    color: white;
                    background-color: #212b43;
                    text-decoration: none;
                    border-radius: 5px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Welcome to Trekkyfy!</h2>
                <p>Thank you for registering as a guide at Trekkyfy! Complete your profile by clicking the button below.</p>
                <p style="text-align: center;">
                    <a class="button" href="https://trekkyfy.vercel.app/complete-guide-profile?guide_id={guide_id}">
                        Complete Profile
                    </a>
                </p>
                <p>Your unique Guide ID is: <strong>{guide_id}</strong></p>
                <p>Best Regards,<br/>Trekkyfy Team</p>
            </div>
        </body>
        </html>
        """
        msg = Message(
            "Welcome to Trekkyfy", sender="your-email@gmail.com", recipients=[email]
        )
        msg.html = html_content
        mail.send(msg)
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False
    return True


@reg_bp.route("/register", methods=["POST"])
def register():
    """Register a new user (Guide/Hiker) with email verification."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request body"}), 400

        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
        role = data.get("role", "hiker")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User already exists"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        guide_id = generate_unique_guide_id() if role == "guide" else None
        hiker_id = generate_unique_hiker_id() if role == "hiker" else None

        user = User(
            username=username,
            email=email,
            password=hashed_password,
            role=role,
            guide_id=guide_id,
            hiker_id=hiker_id,
            registered_on=datetime.utcnow(),
        )
        db.session.add(user)
        db.session.commit()

        if role == "guide":
            email_sent = send_guide_details_email(email, guide_id)
            if not email_sent:
                return (
                    jsonify({"error": "User registered, but email sending failed"}),
                    500,
                )

        return (
            jsonify(
                {
                    "message": "User registered successfully",
                    "user": {
                        "username": username,
                        "email": email,
                        "role": role,
                        "guide_id": guide_id,
                        "hiker_id": hiker_id,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
