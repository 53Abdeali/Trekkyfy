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
from models import GuideDetails, HikerRequest, PriavlGuideResponse, db, User, ChatRequests, ChatResponses
from config import (
    SECRET_KEY,
    JWT_SECRET_KEY,
    JWT_ACCESS_TOKEN_EXPIRES_HOURS,
    SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS,
    MAIL_SERVER,
    MAIL_PORT,
    MAIL_USE_TLS,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    FRONTEND_ORIGINS,
    SOCKET_CORS_ALLOWED_ORIGINS,
)


# Cloudinary Configuration
if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
    )
else:
    print("Cloudinary credentials are not fully configured. Upload features may fail.")

# App configuration
app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": FRONTEND_ORIGINS}},
    supports_credentials=True,
)

app.config["SECRET_KEY"] = SECRET_KEY
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=JWT_ACCESS_TOKEN_EXPIRES_HOURS)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

# for forgot password
app.config["MAIL_SERVER"] = MAIL_SERVER
app.config["MAIL_PORT"] = MAIL_PORT
app.config["MAIL_USE_TLS"] = MAIL_USE_TLS
app.config["MAIL_USERNAME"] = MAIL_USERNAME
app.config["MAIL_PASSWORD"] = MAIL_PASSWORD

# Enabling web socket using SocketIO
socketio = SocketIO(
    app,
    async_mode="eventlet",
    cors_allowed_origins=SOCKET_CORS_ALLOWED_ORIGINS,
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
def handle_connect(sid):
    user_id = request.args.get("user_id")
    user_type = request.args.get("user_type")  # "guide" or "hiker"

    if user_id and user_type:
        online_users[user_id] = "online"
        eventlet.spawn_n(update_last_seen, user_id, "online")
        if user_type == "guide":
            join_room(user_id)
            print(f"Guide {user_id} joined room {user_id}")
        socketio.emit(
            "update_status", {"user_id": user_id, "status": "online"}, to=user_id
        )
        print(f"{user_type.capitalize()} {user_id} connected via websocket.")
    else:
        print("No user_id or user_type provided on connect.")


@socketio.on("disconnect")
def handle_disconnect():
    user_id = request.args.get("user_id")

    if user_id:
        online_users.pop(user_id, None)
        current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        eventlet.spawn_n(update_last_seen, user_id, current_time)
        print(f"User {user_id} disconnected; last_seen updated.")
    else:
        print("No user_id provided on disconnect.")


@socketio.on("chat_request")
def handle_chat_request(data):
    hiker_id = data.get("hiker_id")
    guide_id = data.get("guide_id")
    user_type = data.get("user_type")

    hiker = User.query.filter_by(hiker_id=hiker_id).first()
    hiker_username = hiker.username if hiker else "Unknown"

    if not hiker_id or not guide_id or user_type != "hiker":
        print("Invalid chat request: Missing guide_id, hiker_id, or wrong user_type")
        socketio.emit(
            "chat_request",
            {"status": "error", "error": "Invalid request"},
            room=hiker_id,
            namespace="/",
            ignore_queue=True,
        )
        return

    try:
        eventlet.spawn_n(process_chat_request, hiker_id, guide_id, hiker_username)
        return {"status": "success"}
    except Exception as e:
        print(f"Error handling chat_request: {e}")
        socketio.emit(
            "chat_request", {"status": "error", "error": str(e)}, room=hiker_id
        )


def process_chat_request(hiker_id, guide_id, hiker_username):
    with app.app_context():
        with app.test_request_context():
            try:
                new_request = ChatRequests(
                    hiker_id=hiker_id, guide_id=guide_id, status="pending"
                )
                db.session.add(new_request)
                db.session.commit()

                hiker = User.query.filter_by(hiker_id=hiker_id).first()
                hiker_username = hiker.username if hiker else "Unknown"

                try:
                    socketio.emit(
                        "chat_request",
                        {
                            "hiker_id": hiker_id,
                            "guide_id": guide_id,
                            "hiker_username": hiker_username,
                        },
                        room=guide_id,
                    )
                    print(
                        f"Hiker {hiker_id} - ({hiker_username}) sent chat request to Guide {guide_id}"
                    )
                    socketio.emit("chat_request", {"status": "success"}, room=hiker_id)
                    return {"status": "success"}

                except Exception as e:
                    print(f"Guide {guide_id} is not online, request pending.", e)

            except Exception as e:
                db.session.rollback()
                print(f"Error processing chat request: {e}")
                socketio.emit(
                    "chat_request", {"status": "error", "error": str(e)}, room=hiker_id
                )


@socketio.on("chat_response")
def handle_chat_response(data):
    guide_id = data.get("guide_id")
    hiker_id = data.get("hiker_id")
    accepted = data.get("accepted")
    guide_whatsapp = data.get("guide_whatsapp")

    if not guide_id or not hiker_id:
        print("Missing guide_id or hiker_id in chat_response")
        return

    accepted = True if str(accepted).strip().lower() in ["true", "1", "yes"] else False
    print(f"🔍 DEBUG: accepted={accepted}, type={type(accepted)}")

    eventlet.spawn_n(
        process_chat_response, guide_id, hiker_id, accepted, guide_whatsapp
    )


def process_chat_response(guide_id, hiker_id, accepted, guide_whatsapp):
    with app.app_context():
        with app.test_request_context():
            try:
                request = ChatRequests.query.filter_by(
                    hiker_id=hiker_id, guide_id=guide_id, status="pending"
                ).first()

                if request:
                    request.status = "accepted" if accepted else "rejected"
                    db.session.commit()

                    new_response = ChatResponses(
                        hiker_id=hiker_id,
                        guide_id=guide_id,
                        accepted=accepted,
                        guide_whatsapp=guide_whatsapp,
                    )
                    db.session.add(new_response)
                    db.session.commit()

                    socketio.emit(
                        "chat_response",
                        {
                            "guide_id": guide_id,
                            "accepted": accepted,
                            "guide_whatsapp": guide_whatsapp,
                            "hiker_id": hiker_id,
                        },
                        room=hiker_id,
                    )

                    if accepted:
                        print(f"Accepted condition triggered for guide {guide_id}")
                        guide = GuideDetails.query.filter_by(guide_id=guide_id).first()
                        if guide and guide.guide_whatsapp:
                            whatsapp_url = f"https://wa.me/{guide.guide_whatsapp}"
                            print(whatsapp_url)
                            socketio.emit(
                                "whatsapp_link",
                                {"whatsapp_url": whatsapp_url},
                                room=hiker_id,
                            )
                            print(
                                f"Guide {guide_id} accepted chat request, WhatsApp link has been sent to Hiker {hiker_id}"
                            )
                        else:
                            print(
                                f"Guide {guide_id} accepted chat request but has no WhatsApp number."
                            )

                    else:
                        print(
                            f"Guide {guide_id} rejected chat request from Hiker {hiker_id}"
                        )

                else:
                    print("Chat request not found or already processed!")

            except Exception as e:
                print(f"Error in handling chat response: {e}")


@socketio.on("heartbeat")
def handle_heartbeat(data):
    user_id = data.get("user_id")

    if user_id:
        current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        update_last_seen(user_id, current_time)
        print(f"Heartbeat received for {user_id}, updated last_seen to {current_time}")
    else:
        print("Heartbeat received with no user_id.")


@socketio.on("price_availability_req")
def handle_price_availability(data):
    hiker_id = data.get("hiker_id")
    guide_id = data.get("guide_id")
    user_type = data.get("user_type")

    if not hiker_id or not guide_id or user_type != "hiker":
        print("Invalid chat request: Missing guide_id, hiker_id, or wrong user_type")
        socketio.emit(
            "price_availability_req",
            {"status": "error", "error": "Invalid request"},
            room=hiker_id,
        )
        return

    try:
        eventlet.spawn_n(process_price_availability, hiker_id, guide_id)
        return {"status": "success"}
    except Exception as e:
        print(f"Error handling chat_request: {e}")
        socketio.emit(
            "price_availability_req",
            {"status": "error", "error": str(e)},
            room=hiker_id,
        )


def process_price_availability(hiker_id, guide_id):
    with app.app_context():
        with app.test_request_context():
            try:
                new_pri_avl = HikerRequest(
                    hiker_id=hiker_id, guide_id=guide_id, status="pending"
                )
                db.session.add(new_pri_avl)
                db.session.commit()

                hiker = User.query.filter_by(id=hiker_id).first()
                hiker_username = hiker.username if hiker else "Unknown"

                if guide_id in online_users:
                    socketio.emit(
                        "price_availability_req",
                        {
                            "hiker_id": hiker_id,
                            "guide_id": guide_id,
                            "hiker_username": hiker_username,
                        },
                        room=guide_id,
                    )
                    print(
                        f"Hiker {hiker_id} - ({hiker_username}) sent price & availabilty request to Guide {guide_id}"
                    )
                    socketio.emit(
                        "price_availability_req", {"status": "success"}, room=hiker_id
                    )
            except Exception as e:
                db.session.rollback()
                print(f"Error processing chat request: {e}")
                socketio.emit(
                    "price_availability_req",
                    {"status": "error", "error": str(e)},
                    room=hiker_id,
                )


@socketio.on("price_availability_response")
def handle_price_availability_response(data):
    guide_id = data.get("guide_id")
    hiker_id = data.get("hiker_id")
    accepted = data.get("accepted")

    if not guide_id or not hiker_id:
        print("🚨 Missing guide_id or hiker_id in chat_response")
        return

    accepted = True if str(accepted).strip().lower() in ["true", "1", "yes"] else False
    print(f"🔍 DEBUG: accepted={accepted}, type={type(accepted)}")

    eventlet.spawn_n(
        process_price_availability_response,
        guide_id,
        hiker_id,
        accepted,
    )


def process_price_availability_response(guide_id, hiker_id, accepted):
    with app.app_context():
        with app.test_request_context():
            try:
                request = HikerRequest.query.filter_by(
                    hiker_id=hiker_id, guide_id=guide_id, status="pending"
                ).first()

                if request:
                    request.status = "accepted" if accepted else "rejected"
                    db.session.commit()
                    
                    response_obj = PriavlGuideResponse.query.filter_by(
                        hiker_id=hiker_id, guide_id=guide_id
                    ).first()

                    if response_obj:
                        response_obj.accepted = accepted
                        db.session.commit()
                    
                    else:
                        new_response = PriavlGuideResponse(
                            hiker_id=hiker_id,
                            guide_id=guide_id,
                            accepted=accepted,
                        )
                        db.session.add(new_response)
                        db.session.commit()

                    socketio.emit(
                        "price_availability_response",
                        {
                            "guide_id": guide_id,
                            "accepted": accepted,
                            "hiker_id": hiker_id,
                        },
                        room=hiker_id,
                    )

                    if accepted:
                        print(f"Accepted condition triggered for guide {guide_id}")

                    else:
                        print(
                            f"Guide {guide_id} rejected chat request from Hiker {hiker_id}"
                        )

                else:
                    print("Chat request not found or already processed!")

            except Exception as e:
                print(f"Error in handling chat response: {e}")


def update_last_seen(user_id, status):
    eventlet.spawn_n(process_update_last_seen, user_id, status)


def process_update_last_seen(user_id, status):
    with app.app_context():
        try:
            user = User.query.filter(
                (User.guide_id == user_id) | (User.hiker_id == user_id)
            ).first()

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
        except Exception as e:
            print(f"Error in updating last_seen: {e}")


# API Health Check
@app.route("/")
def home():
    return jsonify(
        {
            "message": "The Python app is running successfully on the port number 5000 and on render as well!"
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host="0.0.0.0", port=port)
