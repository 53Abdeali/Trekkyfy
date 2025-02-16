import eventlet

eventlet.monkey_patch()

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
from models import db, User


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
socketio = SocketIO(
    app, cors_allowed_origins=["https://trekkyfy.vercel.app", "http://localhost:3000"]
)
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
    guide_id = request.args.get("guide_id")
    if guide_id:
        online_users[guide_id] = "online"
        update_last_seen(guide_id, "online")
        emit("update_status", {"guide_id": guide_id, "status": "online"}, broadcast=True)
        print(f"Guide {guide_id} connected via websocket.")
    else:
        print("No guide_id provided on connect.")


@socketio.on("disconnect")
def handle_disconnect():
    guide_id = request.args.get("guide_id")
    if guide_id:
        online_users.pop(guide_id, None)
        current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        update_last_seen(guide_id, current_time)
        print(f"Guide {guide_id} disconnected; last_seen updated.")
    else:
        print("No guide_id provided on disconnect.")


@socketio.on('heartbeat')
def handle_heartbeat(data):
    guide_id = data.get("guide_id")
    if guide_id:
        current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        update_last_seen(guide_id, current_time)
        print(f"Heartbeat received for guide {guide_id}, updated last_seen to {current_time}")
    else:
        print("Heartbeat received with no guide_id.")


def update_last_seen(guide_id, status):
    user = User.query.filter_by(guide_id=guide_id).first()
    if user:
        user.last_seen = status 
        try:
            db.session.commit()
            print(f"Updated last_seen for user with guide_id {guide_id}: {user.last_seen}")
        except Exception as e:
            db.session.rollback()
            print(f"Error updating last_seen for user with guide_id {guide_id}: {e}")
    else:
        print(f"User with guide_id {guide_id} not found.")


# API Health Check
@app.route("/")
def home():
    return jsonify({"message": "The Python app is running successfully on port 5000!"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host="0.0.0.0", port=port)
