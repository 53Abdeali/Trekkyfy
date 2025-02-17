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
from flask_socketio import SocketIO, emit, join_room
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
chat_requests = {}

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
    user_type = request.args.get("user_type")  # "guide" or "hiker"

    if user_id and user_type:
        online_users[user_id] = "online"
        update_last_seen(user_id, "online")
        join_room("user_id")
        emit("update_status", {"user_id": user_id, "status": "online"}, broadcast=True)
        print(f"{user_type.capitalize()} {user_id} connected via websocket.")
    else:
        print("No user_id or user_type provided on connect.")


@socketio.on("disconnect")
def handle_disconnect():
    user_id = request.args.get("user_id")
    
    if user_id:
        online_users.pop(user_id, None)
        current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        update_last_seen(user_id, current_time)
        print(f"User {user_id} disconnected; last_seen updated.")
    else:
        print("No user_id provided on disconnect.")

@socketio.on("send_chat_request")
def handle_chat_request(data):
    hiker_id = data.get("hiker_id")
    guide_id = data.get("guide_id")

    if not hiker_id or not guide_id:
        return

    chat_requests[hiker_id] = guide_id  # Store pending request

    if guide_id in online_users:
        emit("send_chat_request", {"hiker_id": hiker_id}, room=guide_id)
        print(f"Hiker {hiker_id} sent chat request to Guide {guide_id}")
    else:
        print(f"Guide {guide_id} is not online, request pending.")
    
@socketio.on("respond_chat_request")
def handle_chat_response(data):
    guide_id = data.get("guide_id")
    hiker_id = data.get("hiker_id")
    accepted = data.get("accepted")

    if not guide_id or not hiker_id:
        return

    if accepted:
        emit("chat_accepted", {"guide_id": guide_id}, room=hiker_id)
        print(f"Guide {guide_id} accepted chat request from Hiker {hiker_id}")
    else:
        emit("chat_rejected", {"guide_id": guide_id}, room=hiker_id)
        print(f"Guide {guide_id} rejected chat request from Hiker {hiker_id}")

    # Remove request from pending list
    chat_requests.pop(hiker_id, None)


@socketio.on("heartbeat")
def handle_heartbeat(data):
    user_id = data.get("user_id")
    
    if user_id:
        current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        update_last_seen(user_id, current_time)
        print(f"Heartbeat received for {user_id}, updated last_seen to {current_time}")
    else:
        print("Heartbeat received with no user_id.")


def update_last_seen(user_id, status):
    user = User.query.filter((User.guide_id == user_id) | (User.hiker_id == user_id)).first()
    
    if user:
        user.last_seen = status
        try:
            db.session.commit()
            print(f"Updated last_seen for user {user_id}: {user.last_seen}")
        except Exception as e:
            db.session.rollback()
            print(f"Error updating last_seen for user {user_id}: {e}")
    else:
        print(f"User {user_id} not found.")


# API Health Check
@app.route("/")
def home():
    return jsonify({"message": "The Python app is running successfully on port 5000!"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host="0.0.0.0", port=port)
