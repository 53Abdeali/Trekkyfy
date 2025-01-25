from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from extensions import db, jwt, bcrypt  # type: ignore
from flask_jwt_extended import create_access_token  # type: ignore
import secrets
from datetime import timedelta

# App configuration
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

secret_key = secrets.token_hex(32)
jwt_secret_key = secrets.token_hex(32)

app.config["SECRET_KEY"] = secret_key
app.config["JWT_SECRET_KEY"] = jwt_secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=10) 
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Active%4053@localhost/trekyatra"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app) 
bcrypt.init_app(app)
jwt.init_app(app)

# Import models
from models import User

# Create database tables
with app.app_context():
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

# API Health Check
@app.route("/")
def home():
    return jsonify({"message": "The Python app is running successfully on port 5000!"})

if __name__ == "__main__":
    app.run(debug=True)
