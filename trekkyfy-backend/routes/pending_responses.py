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
        responses = db.session.query(ChatResponses, GuideDetails.guide_whatsapp, User.username).join(
            GuideDetails, ChatResponses.guide_id == GuideDetails.guide_id
        ).join(User, User.guide_id == GuideDetails.guide_id).filter(ChatResponses.hiker_id == hiker_id).all()
        result = []
        for resp, guide_whatsapp, guide_username in responses:
            result.append(
                {
                    "guide_id": resp.guide_id,
                    "hiker_id": resp.hiker_id,
                    "accepted": resp.accepted,
                    "guide_whatsapp": guide_whatsapp,
                    "guide_username": guide_username,
                    "created_at": resp.created_at.isoformat(),
                }
            )
            resp.notified = True
        db.session.commit()
        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
