from flask import Blueprint, request, jsonify  # type: ignore
from models import User
from extensions import db, bcrypt
import random
import string
from extensions import mail
from flask_mail import Message  # type:ignore


def generate_unique_guide_id():
    letters = random.choices(string.ascii_letters, k=3)
    digits = random.choices(string.digits, k=3)
    guide_id = "".join(random.sample(letters + digits, 6))
    if not User.query.filter_by(guide_id=guide_id).first():
        return guide_id


def send_guide_details_email(email, guide_id):
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Complete Your Guide Profile - Trekkyfy</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
      body {{
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 20px;
        background-color: #f7f7f7;
      }}
      .trekkyfy-title {{
        font-family: 'Alex Brush', "Montserrat", "serif";
        font-size: 2rem;
        color: #212b43;
        text-align: center;
        margin-bottom: 20px;
      }}
      .content {{
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        max-width: 600px;
        margin: auto;
      }}
      .button {{
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        font-size: 1rem;
        color: white;
        background-color: #212b43;
        text-decoration: none;
        border-radius: 5px;
      }}
    </style>
  </head>
  <body>
    <div class="content">
      <h2 class="trekkyfy-title">Trekkyfy</h2>
      <p>Hello,</p>
      <p>
        Thank you for registering as a guide at Trekkyfy! We are excited to have you on board and look forward to the amazing journeys you'll lead.
      </p>
      <p>
        To complete your registration and finalize the necessary formalities, please click the button below to finish setting up your guide profile.
      </p>
      <p style="text-align: center;">
        <a class="button" href="https://trekkyfy.vercel.app/complete-guide-profile?guide_id={guide_id}">Complete Profile</a>
      </p>
      <p>
        Your unique Guide ID is: <strong>{guide_id}</strong>.
      </p>
      <p>
        Once you complete your profile, you'll be able to manage your listings and connect with hiking enthusiasts.
      </p>
      <p>
        If you have any questions, feel free to reply to this email. We're here to support you every step of the way.
      </p>
      <p style="color: #555;">
        Happy Guiding,<br />
        Warm Regards,<br />
        The Trekkyfy Team
      </p>
    </div>
  </body>
</html>
        """

    msg = Message(
        "Welcome to Trekkyfy", sender="aliabdealifakhri53@gmail.com", recipients=[email]
    )
    msg.html = html_content
    mail.send(msg)


reg_bp = Blueprint("register", __name__)


@reg_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request body"}), 400
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400

    username = data.get("username")
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    role = data.get("role", "hiker")
    guide_id = None

    if role == "guide":
        guide_id = generate_unique_guide_id()

    user = User(
        username=username,
        email=data["email"],
        password=hashed_password,
        role=role,
        guide_id=guide_id,
    )
    db.session.add(user)
    db.session.commit()

    if role == "guide":
        send_guide_details_email(data["email"], guide_id)

    return jsonify({"message": "User registered successfully"}), 201
