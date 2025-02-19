from flask import Blueprint, jsonify, request
from extensions import db
from models import ChatRequests

pending_req_bp = Blueprint("Pending Requests", __name__)


@pending_req_bp.route("/pending-requests", methods=["GET"])
def pend_req():
    guide_id = request.args.get("guide_id")
    if not guide_id:
        return jsonify({"error": "Guide ID not provided"}), 400

    try:
        pending_reqs = ChatRequests.query.filter_by(
            guide_id=guide_id, status="pending"
        ).all()
        result = []
        for req in pending_reqs:
            result.append(
                {
                    "hiker_id": req.hiker_id,
                    "guide_id": req.guide_id,
                    "status": req.status,
                }
            )
        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
