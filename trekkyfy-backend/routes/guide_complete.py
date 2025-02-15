from flask import Blueprint, request, jsonify
from models import db, GuideDetails
from flask_jwt_extended import jwt_required, get_jwt  # type: ignore

guide_bp = Blueprint("Guide_Details", __name__)

@guide_bp.route("/guides", methods=["POST"])
@jwt_required()
def update_guide_profile():
    data = request.get_json()
    claims = get_jwt()
    guide_id = claims.get("guide_id")
    if not guide_id:
        return jsonify({"message": "Authenticated user does not have a guide id."}), 400

    guide = GuideDetails.query.filter_by(guide_id=guide_id).first()
    if not guide:
        print("Guide record not found for guide_id:", guide_id)
        guide = GuideDetails(guide_id=guide_id)
        db.session.add(guide)

    guide.guide_city = data.get("guide_city")
    guide.guide_district = data.get("guide_district")
    guide.guide_state = data.get("guide_state")
    guide.guide_phone = data.get("guide_phone")
    guide.guide_whatsapp = data.get("guide_whatsapp")
    guide.guide_experience = data.get("guide_experience")
    guide.guide_languages = data.get("guide_languages")
    guide.guide_speciality = data.get("guide_speciality")
    guide.guide_photo = data.get("guide_photo")

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": "An error occurred while updating guide details.",
            "error": str(e)
        }), 500

    return jsonify({"message": "Guide details updated successfully"})

#GET GUIDE PROFILE
@guide_bp.route("/guide", methods=["GET"])
@jwt_required()
def get_guide_profile():
    claims = get_jwt()
    guide_id = claims.get("guide_id")
    if not guide_id:
        return jsonify({"message": "Authenticated user does not have a guide id."}), 400
    guide = GuideDetails.query.filter_by(guide_id=guide_id).first()
    if not guide:
        return jsonify({"message": "Guide not found."}), 404
    return jsonify({
        "guide_city": guide.guide_city,
        "guide_district": guide.guide_district,
        "guide_state": guide.guide_state,
        "guide_phone": guide.guide_phone,
        "guide_whatsapp": guide.guide_whatsapp,
        "guide_experience": guide.guide_experience,
        "guide_languages": guide.guide_languages,
        "guide_speciality": guide.guide_speciality,
        "guide_photo": guide.guide_photo
    })

