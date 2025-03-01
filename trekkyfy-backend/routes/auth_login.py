from flask import Blueprint, request, jsonify, make_response
from models import User
from extensions import bcrypt, db
from flask_jwt_extended import create_access_token  # type: ignore
from datetime import datetime

log_bp = Blueprint("login", __name__)


@log_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request body"}), 400
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    if user.guide_id:
        user.last_seen = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print("Error updating last_seen on login:", e)

    additional_claims = {"username": user.username}
    if user.guide_id:
        additional_claims["guide_id"] = user.guide_id
    if user.hiker_id:
        additional_claims["hiker_id"] = user.hiker_id

    access_token = create_access_token(
        identity=user.email, additional_claims=additional_claims
    )

    # Set token in cookie
    response = make_response(jsonify({"access_token": access_token}), 200)
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        max_age=36000,
        secure=True,
        samesite="None",
    )

    return response
