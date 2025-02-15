from flask import Flask, jsonify  # type: ignore
from flask_cors import CORS
from extensions import db, jwt, bcrypt  # type: ignore
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail # type: ignore
import secrets
from datetime import timedelta
import os
from routes import register_blueprints

# App configuration
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://trekkyfy.vercel.app", "http://localhost:3000"]}}, supports_credentials=True)

secret_key = os.getenv("SECRET_KEY", "66da30be6ce1360c4614b51ed81f8b313847a1920d814d6ef2c07bf2abb28e06")
jwt_secret_key = os.getenv("JWT_SECRET_KEY","bde21c69993e8a62ff9e9cd1d19d8b7bbefda66cc24c2ff29f4bdb25d92592bf")
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


mail = Mail(app)
s = URLSafeTimedSerializer(secret_key)
db.init_app(app) 
bcrypt.init_app(app)
jwt.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

register_blueprints(app)

# API Health Check
@app.route("/")
def home():
    return jsonify({"message": "The Python app is running successfully on port 5000!"})


if __name__ == "__main__":
    app.run(debug=True)
