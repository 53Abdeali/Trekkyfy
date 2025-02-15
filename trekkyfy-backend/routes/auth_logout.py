from Flask import Blueprint, jsonify, make_response # type: ignore

logout_bp = Blueprint("logout", __name__)

@logout_bp.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie("access_token", "", expires=0)  
    return response