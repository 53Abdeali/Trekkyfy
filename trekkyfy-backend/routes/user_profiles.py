from flask import Blueprint, request, jsonify # type: ignore
from models import User
from flask_jwt_extended import decode_token  # type: ignore
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError # type: ignore

user_profile_bp = Blueprint("user_profile", __name__)

user_profile_bp.route("/user-profile", methods=["GET"])
def user_profile():
    access_token = request.cookies.get("access_token")
    
    if not access_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        decoded_token = decode_token(access_token)
        user_identity = decoded_token["sub"]
        user = User.query.filter_by(email=user_identity).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"email": user.email, "username": user.username}), 200
    
    except ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401