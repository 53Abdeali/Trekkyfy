from datetime import datetime
from flask import Blueprint, request, jsonify
from models import HikerRequest
from extensions import db

hiker_info_bp = Blueprint("Hiker Information For Pricing", __name__)


@hiker_info_bp.route("/avl-price-req", methods=["POST"])
def price_avl_req():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request body"}), 400
    if (
        not data.get("hiker_id")
        or not data.get("hiker_username")
        or not data.get("trek_place")
        or not data.get("hiking_members")
        or not data.get("trek_date")
        or not data.get("trek_time")
    ):
        return jsonify({"Error": "All fields are required!"}), 400

    hiker_id = data.get("hiker_id")
    hiker_username = data.get("hiker_username")
    trek_place = data.get("trek_place")
    hiking_members = data.get("hiking_members")
    trek_date = datetime.strptime(data.get("trek_date"), "%Y-%m-%d").date()
    trek_time = datetime.strptime(data.get("trek_time"), "%H:%M:%S").time()

    try:
        hiker_req = HikerRequest(
            hiker_id=hiker_id,
            hiker_username=hiker_username,
            trek_place=trek_place,
            hiking_members=hiking_members,
            trek_date=trek_date,
            trek_time=trek_time,
            created_at=datetime.utcnow(),
        )

        db.session.add(hiker_req)
        db.session.commit()
        return jsonify({"Success": "Request has been stored in the database!"}), 200
    except Exception as e:
        return jsonify({"Error": str(e)}), 500
