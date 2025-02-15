from Flask import Blueprint, request, jsonify # type: ignore
from models import User
from extensions import db, bcrypt

reg_bp = Blueprint("register", __name__)

@reg_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid request body"}), 400
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400
    
    username = data.get("username")
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    role = data.get('role', 'hiker')
    
    user = User(username=username,email=data["email"], password=hashed_password, role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201
