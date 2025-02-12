from flask import Flask, make_response, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from extensions import db, jwt, bcrypt  # type: ignore
from flask_jwt_extended import create_access_token, decode_token  # type: ignore
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message # type: ignore
import secrets
from datetime import timedelta

# App configuration
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://trekkyfy.vercel.app"}}, supports_credentials=True)

secret_key = secrets.token_hex(32)
jwt_secret_key = secrets.token_hex(32)
salt = secrets.token_hex(16)

app.config["SECRET_KEY"] = secret_key
app.config["JWT_SECRET_KEY"] = jwt_secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=10) 
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://avnadmin:AVNS_P-7RDq_tkUVMeTbEKnV@mysql-21f3bc70-aliabdealifakhri53-78d7.i.aivencloud.com:14791/trekkyfy"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#for forgot password
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "aliabdealifakhri53@gmail.com"
app.config["MAIL_PASSWORD"] = "qenu jgor alhv zoui"
# app.config["SERVER_NAME"] = "localhost:5000"


mail = Mail(app)

s = URLSafeTimedSerializer(secret_key)

db.init_app(app) 
bcrypt.init_app(app)
jwt.init_app(app)

# Import models
from models import User

# Create database tables
with app.app_context():
    logo_url = "http://localhost:5000/static/ty.png"
    db.create_all()

# API Call for Register
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400
    
    username = data.get("username", "default_username")

    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    
    role = data.get('role', 'hiker')

    user = User(email=data["email"], password=hashed_password, username=username, role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# API Call for Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.email)
    response = make_response(jsonify({"access_token": access_token}), 200)
    response.set_cookie("access_token", access_token, httponly=True, max_age=36000, samesite="Strict")
    return response

#Protected Route (Get Cookies)
@app.route("/api/user-profile", methods=["GET"])
def user_profile():
    access_token = request.cookies.get("access_token")
    
    if not access_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        decoded_token = decode_token(access_token, secret_key, algorithms=["HS256"])
        user_identity = decoded_token["sub"]
        user = User.query.filter_by(email=user_identity).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"email": user.email, "username": user.username}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

   
#API Call for Logout
@app.route("/api/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie("access_token", "", expires=0)  
    return response


#API Call for Forgot Password
@app.route("/api/forgot-password", methods = ["POST"])
def forgot_password():
    data = request.get_json()
    
    email = data.get("email")
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message" : "If the email is registered, a reset link will be sent."}),200
    
    token = s.dumps(email, salt=salt)
    
    reset_url = f"https://trekkyfy.vercel.app/reset-password/{token}"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
            <a href="https://imgbb.com/"><img style= "width:100px; height:100px" src="https://i.ibb.co/0VtXQSkm/ty.png" alt="ty" border="0"></a>
        </div>
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi,</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="{reset_url}" style="color: #007BFF; text-decoration: none;">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p style="color: #555;">Thank you,<br/>The Trekkyfy Team</p>
    </body>
    </html>
    """
    
    msg = Message("Password Reset Request",
                  sender="aliabdealifakhri53@gmail.com",
                  recipients=[email])
    msg.html = html_content
    mail.send(msg)

    return jsonify({"message": "If the email is registered, a reset link has been sent."}), 200


#API for Reset Password
@app.route("/api/reset-password/<token>", methods = ["POST"])
def reset_password(token):
    try:
        email = s.loads(token, salt=salt, max_age=3600)
    except Exception:
        return jsonify({"message": "Invalid or expired token."}), 400
    
    data = request.get_json()
    new_password = data.get("password")
    
    if not new_password:
        return({"message" : "Password is required."}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")
        user.password = hashed_password
        db.session.commit()
        return jsonify({"message": "Password reset successful!"}), 200
    
    return jsonify({"message": "User not found."}), 404


#API for Newsletter Subscription
from models import Subscriber
@app.route("/api/newsletter", methods = ["POST"])
def newsletter():
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

from models import Feedback
@app.route("/api/feedback", methods = ["POST"])
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
    
    
from models import Question
@app.route("/api/question", methods = ["POST"])   
def frequent_question():
    data = request.get_json()
    question = data.get("question")
    email = data.get("email")
    
    try:
        if not question or not email:
            return jsonify({"error" : "None of the both field could be empty."}),500
        
        new_question = Question(question = question, email = email)
        db.session.add(new_question)
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
        <h2 style="color: #2c3e50;">We've Received Your Question! 📩</h2>
        <p>Hi there,</p>
        <p>
            Thank you for reaching out to Trekkyfy! We truly appreciate your curiosity and engagement. Your question has been received, and our team will review it shortly.
        </p>
        <p>
            If your question is relevant and aligns with our 
            <a href="https://www.Trekkyfy.com/terms" style="color: #2980b9; text-decoration: none;">Terms & Conditions</a> 
            and 
            <a href="https://www.Trekkyfy.com/privacy" style="color: #2980b9; text-decoration: none;">Privacy Policy</a>, 
            we will get back to you as soon as possible. We strive to provide accurate and helpful information to enhance your trekking experience.
        </p>  
        <p>Meanwhile, here are some key features you can explore:</p>    
        <ul style="padding-left: 20px;">
            <li>🌍 Discover breathtaking trekking destinations.</li>
            <li>🗺️ Plan with expert-curated itineraries.</li>
            <li>🚐 Enjoy hassle-free shuttle services to your trek.</li>
            <li>🤝 Connect with local guides for an authentic adventure.</li>
        </ul>
        <p>
            Stay tuned for updates on upcoming treks, exclusive travel tips, and community experiences!
        </p>
        <p>
            If you have any additional inquiries, feel free to reply to this email or reach out to us directly.
        </p>
        <p style="font-weight: bold;">We appreciate your patience and look forward to assisting you! 🌍✨</p> 
        <p style="color: #555;">
            Happy trekking!<br/>
            Warm Regards,<br/>
            The Trekkyfy Team
        </p>
        </body>
        </html>
        """
        
        msg = Message("Question Reieved Confirmation", 
                      sender = "aliabdealifakhri53@gmail.com" , 
                      recipients = [email])
        msg.html = html_content
        mail.send(msg)
        
        return jsonify({"message" : "Question have been submitted successfully!"}),200
    except Exception as e :
        print(e)
        return jsonify({"error": "Some error occured"}), 500
    
from models import Contact
@app.route("/api/contact", methods = ["POST"])
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



# API Health Check
@app.route("/")
def home():
    return jsonify({"message": "The Python app is running successfully on port 5000!"})


if __name__ == "__main__":
    app.run(debug=True)
