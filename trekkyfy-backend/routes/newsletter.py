from models import Subscriber
from flask import Blueprint, request, jsonify # type: ignore
from extensions import db, mail
from flask_mail import Message  # type: ignore

news_bp = Blueprint("newsletter", __name__)
@news_bp.route("/newsletter", methods = ["POST"])
def newsletters():
    data = request.get_json()
    email = data.get("email")
    
    if not email or not '@' in email:
        return jsonify({"error" : "Invalid email format"}),400
    
    existing = Subscriber.query.filter_by(email = email).first()
    if existing:
        return jsonify({"message" : "Already subscribed to the newsletter"}),200
    
    try:
        new_subscriber = Subscriber(email = email)
        db.session.add(new_subscriber)
        db.session.commit()
        
        html_content = """
 <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Welcome to Trekkyfy</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .trekkyfy-title {
            font-family: 'Alex Brush', cursive;
            font-size: 2rem;
            color: #212b43;
            text-align: center;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h2 class="trekkyfy-title">Trekkyfy</h2>
        <p>Hi,</p>
        <p>
          Welcome to Trekkyfy! We're thrilled to have you as part of our hiking and trekking community. Whether you're a seasoned explorer or just starting your journey, we're here to help you make the most out of your adventures.
        </p>
        <p>
          Here's what you can look forward to:<br />
          🌟 Explore breathtaking trails curated by experienced guides.<br />
          🗺️ Discover hidden gems and plan your perfect trek.<br />
          🚐 Convenient shuttle services to get you where you need to go.<br />
          🤝 Connect with trusted local guides for personalized experiences.
        </p>
        <p>
          Stay tuned for exclusive tips, updates, and exciting announcements—we've got lots of great things planned for you!
        </p>
        <p>
          If you have any questions, feel free to reply to this email. We’re here to help you every step of the way.
        </p>
        <p style="color: #555;">
          Happy Hiking<br />
          Warm Regards<br />
          The Trekkyfy Team
        </p>
      </body>
    </html>
        """
    
        msg = Message("Welcome to Trekkyfy",
                    sender="aliabdealifakhri53@gmail.com",
                    recipients=[email])
        msg.html = html_content
        mail.send(msg)
        return jsonify({"message" : "Subscribed to the newsletter successfully!"}),200
    except Exception as e:
        return jsonify({"error": str(e)}), 500