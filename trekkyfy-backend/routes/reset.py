from flask import Blueprint, request, jsonify # type: ignore
from models import User
from extensions import db, bcrypt
from config import s, salt

reset_bp = Blueprint("reset", __name__)

@reset_bp.route("/reset-password/<token>", methods = ["POST"])
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