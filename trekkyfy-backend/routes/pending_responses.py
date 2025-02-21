from flask import Blueprint, request, jsonify
from extensions import db
from models import ChatResponses, GuideDetails, User
from flask_jwt_extended import jwt_required, get_jwt  # type: ignore

chat_resp_bp = Blueprint("Chat Responses", __name__)


@chat_resp_bp.route("/pending-responses", methods=["GET"])
@jwt_required()
def get_chat_resp():
    claims = get_jwt()
    hiker_id = claims.get("hiker_id")
    if not hiker_id:
        return jsonify({"error": "Hiker ID not found"}), 400

    try:
        responses = ChatResponses.query.filter_by(hiker_id=hiker_id).all()
        result = []
        for resp in responses:
            result.append(
                {
                    "guide_id": resp.guide_id,
                    "hiker_id": resp.hiker_id,
                    "accepted": resp.accepted,
                    "guide_whatsapp": resp.guide.guide_whatsapp if resp.guide else None,
                    "guide_username": resp.guide.user.username if resp.guide else None,
                    "created_at": resp.created_at.isoformat(),
                }
            )
            resp.notified = True
        db.session.commit()
        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
