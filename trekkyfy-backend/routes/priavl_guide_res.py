from flask import Blueprint, request, jsonify
from models import User, db, PriavlGuideResponse
from flask_jwt_extended import jwt_required, get_jwt  # type: ignore

priavl_guide_res_bp = Blueprint("priavl_guide_res", __name__)


@priavl_guide_res_bp.route("/priavl-guide-res", methods=["POST"])
def create_priavl_response():
    data = request.get_json()

    guide_id = data.get("guide_id")
    hiker_id = data.get("hiker_id")
    if not guide_id or not hiker_id:
        return jsonify({"message": "guide_id and hiker_id are required."}), 400

    price = data.get("price")
    availability = data.get("availability")
    if price is None or availability is None:
        return jsonify({"message": "Price and availability are required."}), 400

    try:
        price = float(price)
    except ValueError:
        return jsonify({"message": "Price must be a valid number."}), 400

    if availability not in ["Available", "Unavailable"]:
        return jsonify({"message": "Invalid availability value."}), 400

    partialTime = data.get("partialTime")
    unavailableOption = data.get("unavailableOption")
    unavailabilityReason = data.get("unavailabilityReason")

    new_response = PriavlGuideResponse(
        guide_id=guide_id,
        hiker_id=hiker_id,
        price=price,
        availability=availability,
        partialTime=partialTime,
        unavailableOption=unavailableOption,
        unavailabilityReason=unavailabilityReason,
    )

    db.session.add(new_response)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Response created successfully",
                "data": {
                    "id": new_response.id,
                    "guide_id": new_response.guide_id,
                    "hiker_id": new_response.hiker_id,
                    "price": new_response.price,
                    "availability": new_response.availability,
                    "partialTime": new_response.partialTime,
                    "unavailableOption": new_response.unavailableOption,
                    "unavailabilityReason": new_response.unavailabilityReason,
                    "created_at": new_response.created_at.isoformat(),
                    "updated_at": new_response.updated_at.isoformat(),
                },
            }
        ),
        200,
    )


@priavl_guide_res_bp.route("/guide-priavl-res", methods=["GET"])
@jwt_required()
def get_priavl_res():
    claims = get_jwt()
    hiker_id = claims.get("hiker_id")
    if not hiker_id:
        return jsonify({"error": "Hiker ID not found"}), 400

    try:
        responses = db.session.query(PriavlGuideResponse, User.username).join(
            User, PriavlGuideResponse.guide_id == User.guide_id
        )

        result = []

        for resp, guide_username in responses:
            result.append(
                {
                    "guide_id": resp.guide_id,
                    "hiker_id": resp.hiker_id,
                    "price": resp.price,
                    "availability": resp.availability,
                    "partialTime": resp.partialTime,
                    "unavailableOption": resp.unavailableOption,
                    "unavailabilityReason": resp.unavailabilityReason,
                    "guide_username": guide_username,
                    "accepted": resp.accepted,
                }
            )
            resp.notified = True
        db.session.commit()
        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
