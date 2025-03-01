# booking_routes.py
from flask import Blueprint, request, jsonify
from models import db, Booking

booking_bp = Blueprint("booking_bp", __name__)


@booking_bp.route("/confirmBooking", methods=["POST"])
def confirm_booking():
    data = request.get_json()
    try:
        new_booking = Booking(
            hiker_id=data.get("hiker_id"),
            trek_id=data.get("trek_id"),
            guide_id=data.get("guide_id"),
            details=data,
        )
        db.session.add(new_booking)
        db.session.commit()
        return (
            jsonify({"message": "Booking confirmed", "booking_id": new_booking.id}),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error confirming booking", "error": str(e)}), 500
