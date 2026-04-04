import logging
from flask import Blueprint, request, jsonify
from sqlalchemy import text
from flask_cors import CORS, cross_origin
from extensions import db


wishlist_bp = Blueprint("wishlist", __name__)
CORS(
    wishlist_bp,
    resources={r"/*": {"origins": "https://trekkyfy.vercel.app"}},
    supports_credentials=True,
)

@wishlist_bp.route("/wishlist/<string:hiker_id>", methods=["GET"])
def get_wishlist(hiker_id):
    try:
        result = db.session.execute(
            text(
                """
                SELECT t.id, t.name, t.state, t.nearest_city, t.difficulty_level, 
                    t.duration_days, t.best_time_to_visit, t.guide_availability, t.Links
                FROM wishlist w
                JOIN trails_and_treks t ON w.trail_id = t.id
                WHERE w.hiker_id = :hiker_id
            """
            ),
            {"hiker_id": hiker_id},
        )
        wishlist = [dict(row) for row in result.mappings().all()]
        return jsonify(wishlist)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@wishlist_bp.route("/wishlist/add", methods=["POST"])
@cross_origin(origin="https://trekkyfy.vercel.app", supports_credentials=True)
def add_to_wishlist():
    data = request.json
    hiker_id = data.get("hiker_id")
    trail_id = data.get("trail_id")

    logging.debug(f"Received request: hiker_id={hiker_id}, trail_id={trail_id}")

    if not hiker_id or not trail_id:
        logging.error("Missing required fields")
        return jsonify({"error": "Missing hiker_id or trail_id"}), 400

    try:
        existing = db.session.execute(
            text(
                "SELECT 1 FROM wishlist WHERE hiker_id = :hiker_id AND trail_id = :trail_id"
            ),
            {"hiker_id": hiker_id, "trail_id": trail_id},
        ).first()
        if existing:
            return jsonify({"message": "Already in wishlist"}), 400

        db.session.execute(
            text("INSERT INTO wishlist (hiker_id, trail_id) VALUES (:hiker_id, :trail_id)"),
            {"hiker_id": hiker_id, "trail_id": trail_id},
        )
        db.session.commit()
        response = jsonify({"message": "Added to wishlist"})
        return response, 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error in add_to_wishlist: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@wishlist_bp.route("/wishlist/remove", methods=["POST"])
def remove_from_wishlist():
    data = request.json
    hiker_id = data.get("hiker_id")
    trail_id = data.get("trail_id")

    logging.debug(f"Received request: hiker_id={hiker_id}, trail_id={trail_id}")

    if not hiker_id or not trail_id:
        logging.error("Missing required fields")
        return jsonify({"error": "Missing hiker_id or trail_id"}), 400

    try:
        db.session.execute(
            text("DELETE FROM wishlist WHERE hiker_id = :hiker_id AND trail_id = :trail_id"),
            {"hiker_id": hiker_id, "trail_id": trail_id},
        )
        db.session.commit()
        return jsonify({"message": "Removed from wishlist"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
