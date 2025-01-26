from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from extensions import db, jwt, bcrypt  # type: ignore
from flask_jwt_extended import create_access_token  # type: ignore
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message # type: ignore
import secrets
from datetime import timedelta

# App configuration
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

secret_key = secrets.token_hex(32)
jwt_secret_key = secrets.token_hex(32)
salt = secrets.token_hex(16)

app.config["SECRET_KEY"] = secret_key
app.config["JWT_SECRET_KEY"] = jwt_secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=10) 
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Active%4053@localhost/trekyatra"
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

    user = User(email=data["email"], password=hashed_password, username=username)
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
    return jsonify({"access_token": access_token}), 200


#API Call for Forgot Password
@app.route("/api/forgot-password", methods = ["POST"])
def forgot_password():
    data = request.get_json()
    
    email = data.get("email")
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message" : "If the email is registered, a reset link will be sent."}),200
    
    token = s.dumps(email, salt=salt)
    
    reset_url = f"http://localhost:3000/reset-password/{token}"
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src={logo_url} alt="TrekYatra" style="width: 150px; height: auto;" />
        </div>
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi,</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="{reset_url}" style="color: #007BFF; text-decoration: none;">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p style="color: #555;">Thank you,<br/>The TrekYatra Team</p>
    </body>
    </html>
    """
    
    msg = Message("Password Reset Request",
                  sender="aliabdealifakhri53.com",
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


# API Health Check
@app.route("/")
def home():
    return jsonify({"message": "The Python app is running successfully on port 5000!"})

if __name__ == "__main__":
    app.run(debug=True)
