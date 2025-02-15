from models import Contact
from Flask import Blueprint, request, jsonify # type: ignore
from extensions import db
from app import mail
from flask_mail import Message  # type: ignore

contact_bp = Blueprint("contact", __name__)
@contact_bp.route("/contact", methods = ["POST"])
def contact_us():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    subject = data.get("subject")
    message = data.get("message")
    
    try:
        new_contact_us = Contact(name=name, email=email, phone=phone, subject=subject, message=message)
        db.session.add(new_contact_us)
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
            <h1 class="trekkyfy>Trekkyfy</h1>
        </div>
    
        <h2 style="color: #2c3e50;">Thank You for Contacting Trekkyfy! 🌍</h2>
    
        <p>Hi there,</p>
    
        <p>
        We have received your query through our <strong>Contact Us</strong> form. Thank you for reaching out to us! 
        Our team is reviewing your message, and we will get back to you as soon as possible.
        </p>
    
        <p>
        If your query is urgent, you can check our 
        <a href="https://www.Trekkyfy.com/faq" style="color: #2980b9; text-decoration: none;">FAQs</a> 
        for quick answers or reach out to our support team directly.
        </p>

        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="color: #2c3e50;">✨ Why Trek with Us? ✨</h3>
        <p style="color: #555;">While we process your request, here’s what you can explore:</p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
        <div style="background: #ffffff; padding: 10px 15px; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
          🌍 <strong>Stunning Destinations</strong><br/>Discover breathtaking trekking spots.
        </div>
        <div style="background: #ffffff; padding: 10px 15px; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
          🗺️ <strong>Expert Itineraries</strong><br/>Plan your trek with curated guides.
        </div>
        <div style="background: #ffffff; padding: 10px 15px; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
          🚐 <strong>Hassle-Free Travel</strong><br/>Enjoy smooth shuttle services.
        </div>
        <div style="background: #ffffff; padding: 10px 15px; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
          🤝 <strong>Local Guides</strong><br/>Get real insights from experienced trekkers.
        </div>
        </div>
        </div>

        <p>
        We appreciate your patience and look forward to assisting you soon! 🚀 
        </p>

        <p style="color: #555;">
        Happy trekking!<br/>
        Warm Regards,<br/>
        The Trekkyfy Team
        </p>
        </body>
        </html>
        """
        msg = Message("Query Recieved Confirmation",
                      sender="aliabdealifakhri53@gmail.com", 
                      recipients = [email])
        msg.html = html_content
        mail.send(msg)
        return jsonify({"message" : "Query have been submitted successfully!"}),200
    except Exception as e:
        print(e)
        return jsonify({"error" : "Error in submitting the query!"}), 500