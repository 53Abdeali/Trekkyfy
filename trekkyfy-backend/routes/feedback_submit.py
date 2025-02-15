from models import Feedback
from flask import Blueprint, request, jsonify # type: ignore
from extensions import db, mail
from flask_mail import Message  # type: ignore

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods = ["POST"])
def submit_feedback():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    visited = data.get("visited")
    number = data.get("number")
    message = data.get("message")
    
    try:
        if not name or not email or not visited or not number or not message:
            return jsonify({"error": "All fields are required"}), 400
        
        new_feedback = Feedback(name = name, email=email, visited = visited, number = number, message = message)
        db.session.add(new_feedback)
        db.session.commit()
        
        html_content = """
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
         <style>
          @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          .trekkyfy {
            font-family: 'Alex Brush', cursive;
            font-size: 2rem;
            color: #212b43;
            text-align: center;
            margin-bottom: 20px;
          }
        </style>
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 class="trekkyfy">Trekkyfy</h1>
            </div>
            <h2 style="color: #2c3e50;">Welcome to Trekkyfy! 🌿⛰️</h2>
            <p>Hi there,</p>
            <p>
                A big thank you for joining Trekkyfy! We're thrilled to have you as part of our adventure-loving community. Your feedback means the world to us, and we truly appreciate you taking the time to share your thoughts. Your insights help us improve and create the best trekking experience for everyone!
            </p>
            <p>At Trekkyfy, we believe that every trail tells a story, and we're here to make yours unforgettable. Here's what you can look forward to:</p>    
            <ul style="padding-left: 20px;">
                <li>🌍 Handpicked trails, from hidden gems to iconic routes.</li>
                <li>🗺️ Expert-curated itineraries for the ultimate trekking experience.</li>
                <li>🚐 Hassle-free shuttle services to take you closer to nature.</li>
                <li>🤝 Connect with local guides for authentic and personalized adventures.</li>
            </ul>
            <p>
                We're always working on new features, exciting updates, and exclusive content just for you. Stay tuned for upcoming trekking events, expert tips, and community stories!
            </p>
            <p>
                Got a question or a suggestion? We"d love to hear from you! Simply reply to this email or reach out to us anytime.
            </p>
            <p style="font-weight: bold;">Your adventure begins now—let's explore together! 🌍✨</p> 
            <p style="color: #555;">
                Happy trekking!<br/>
                Warm Regards,<br/>
                The Trekkyfy Team
            </p>
      </body>
      </html>
        """
    
        msg = Message("Thankyou for the Feedback",
                    sender="aliabdealifakhri53@gmail.com",
                    recipients=[email])
        msg.html = html_content
        mail.send(msg)
        
        return jsonify({"message":"Feedback has been submitted Successfully"}),200
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
    