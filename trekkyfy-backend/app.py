from flask import Flask, jsonify, request  # type: ignore
from flask_cors import CORS
from extensions import db, jwt, bcrypt, mail  # type: ignore
from datetime import datetime, timedelta
import os
from routes import register_blueprints
import cloudinary  # type: ignore
import cloudinary.api  # type: ignore
import cloudinary.uploader  # type: ignore
from flask_socketio import SocketIO, emit
import eventlet
from models import db, User

eventlet.monkey_patch()

# Cloudinary Configuration
cloudinary.config(
    cloud_name="dy7g05pop",
    api_key="354388933296936",
    api_secret="IHZnuyiZxbh7l_eR_5Opo6BbDMY",
)

# App configuration
app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {"origins": ["https://trekkyfy.vercel.app", "http://localhost:3000"]}
    },
    supports_credentials=True,
)

secret_key = os.getenv(
    "SECRET_KEY", "66da30be6ce1360c4614b51ed81f8b313847a1920d814d6ef2c07bf2abb28e06"
)
jwt_secret_key = os.getenv(
    "JWT_SECRET_KEY", "bde21c69993e8a62ff9e9cd1d19d8b7bbefda66cc24c2ff29f4bdb25d92592bf"
)

app.config["SECRET_KEY"] = secret_key
app.config["JWT_SECRET_KEY"] = jwt_secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=10)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://avnadmin:AVNS_P-7RDq_tkUVMeTbEKnV@mysql-21f3bc70-aliabdealifakhri53-78d7.i.aivencloud.com:14791/trekkyfy"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# for forgot password
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "aliabdealifakhri53@gmail.com"
app.config["MAIL_PASSWORD"] = "qenu jgor alhv zoui"

# Enabling web socket using SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")
online_users = {}

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
mail.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

register_blueprints(app)


@socketio.on("connect")
def handle_connect():
    user_id = request.args.get("user_id")
    if user_id:
        online_users[user_id] = "online"
        update_last_seen(user_id, "online")
        emit("update_status", {"user_id": user_id, "status": "online"}, broadcast=True)


@socketio.on("disconnect")
def handle_disconnect():
    user_id = request.args.get("user_id")
    if user_id:
        online_users.pop(user_id, None)
        update_last_seen(user_id, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))


def update_last_seen(user_id, status):
    user = User.query.filter_by(id=user_id).first()
    if user:
        user.last_seen = status if status == "online" else datetime.utcnow()


# API Health Check
@app.route("/")
def home():
    return jsonify({"message": "The Python app is running successfully on port 5000!"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host="0.0.0.0", port=port)
