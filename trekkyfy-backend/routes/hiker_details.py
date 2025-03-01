import traceback
from flask import request, jsonify, Blueprint
from models import Hiker, HikerMember
from datetime import datetime
from extensions import db

hiker_details_bp = Blueprint("Hiker_Details", __name__)


@hiker_details_bp.route("/saveHikerDetails", methods=["POST"])
def save_hiker_info():
    try:
        data = request.get_json()
        hiker = Hiker(
            hiker_id=data["hiker_id"],
            hiker_username=data["hiker_username"],
            phone=data["phone"],
            whatsapp=data["whatsapp"],
            email=data["email"],
            current_location=data["current_location"],
            city=data["city"],
            state=data["state"],
            trek_date=datetime.strptime(data["trek_date"], "%Y-%m-%d").date(),
            trek_time=datetime.strptime(data["trek_time"], "%H:%M").time(),
            members=data["members"],
        )
        db.session.add(hiker)
        db.session.commit()

        for member in data.get("memberDetails", []):
            new_member = HikerMember(
                hiker_id=hiker.hiker_id,
                email=member["email"],
                whatsapp=member["whatsapp"],
            )
            db.session.add(new_member)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Hiker information saved successfully!",
                    "hiker_id": hiker.hiker_id,
                }
            ),
            201,
        )
    except Exception as e:
        traceback.print_exc()
        print(e)
        return jsonify({"error": str(e)}), 500


@hiker_details_bp.route("/getHikerDetails/<string:hiker_id>", methods=["GET"])
def get_hiker_info(hiker_id):
    try:
        hiker = Hiker.query.filter_by(hiker_id=hiker_id).first()
        if not hiker:
            return jsonify({"message": "Hiker not found", "hikerExists": False}), 404

        members = HikerMember.query.filter_by(hiker_id=hiker.hiker_id).all()
        member_details = [member.to_dict() for member in members]

        return (
            jsonify(
                {
                    "hikerExists": True,
                    "hikerData": hiker.to_dict(),
                    "memberDetails": member_details,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
