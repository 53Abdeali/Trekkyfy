from flask import Blueprint, request, jsonify
from models import db, GuideDetails

guide_bp = Blueprint("Guide_Details", __name__)


@guide_bp.route("/guide", methods=["POST"])
def guide_profile():
    data = request.get_json()
    guide = GuideDetails.query.filter_by(guide_id=data["guide_id"]).first()

    if not guide:
        return jsonify({"message": "Guide not found. Please register first."}), 404

    guide.guide_id = data.get("guide_id")
    guide.guide_city = data.get("guide_city")
    guide.guide_district = data.get("guide_district")
    guide.guide_state = data.get("guide_state")
    guide.guide_phone = data.get("guide_phone")
    guide.guide_whatsapp = data.get("guide_whatsapp")
    guide.guide_experience = data.get("guide_experience")
    guide.guide_languages = data.get("guide_languages")
    guide.guide_speciality = data.get("guide_speciality")
    guide.guide_photo = data.get("guide_photo")
    db.session.commit()
    return jsonify({"message": "Guide details updated successfully"})
