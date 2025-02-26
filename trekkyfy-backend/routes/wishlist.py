import logging
from flask import Blueprint, request, jsonify
import pymysql.cursors  # type: ignore
import pymysql  # type: ignore
from flask_cors import CORS, cross_origin


wishlist_bp = Blueprint("wishlist", __name__)
CORS(wishlist_bp)


def get_db_connection():
    return pymysql.connect(
        host="mysql-21f3bc70-aliabdealifakhri53-78d7.i.aivencloud.com",
        user="avnadmin",
        password="AVNS_P-7RDq_tkUVMeTbEKnV",
        database="trekkyfy",
        port=14791,
        cursorclass=pymysql.cursors.DictCursor,
    )


@wishlist_bp.route("/wishlist/<string:hiker_id>", methods=["GET"])
def get_wishlist(hiker_id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT t.id, t.name, t.state, t.nearest_city, t.difficulty_level, 
                    t.duration_days, t.best_time_to_visit, t.guide_availability, t.Links
                FROM wishlist w
                JOIN trails_and_treks t ON w.trail_id = t.id
                WHERE w.hiker_id = %s
            """,
                (hiker_id,),
            )
            wishlist = cursor.fetchall()
        conn.close()
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
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM wishlist WHERE hiker_id = %s AND trail_id = %s",
                (hiker_id, trail_id),
            )
            if cursor.fetchone():
                return jsonify({"message": "Already in wishlist"}), 400

            cursor.execute(
                "INSERT INTO wishlist (hiker_id, trail_id) VALUES (%s, %s)",
                (hiker_id, trail_id),
            )
            conn.commit()
        conn.close()
        response = jsonify({"message": "Added to wishlist"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization"
        )
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE")
        return response, 201
    except Exception as e:
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
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "DELETE FROM wishlist WHERE hiker_id = %s AND trail_id = %s",
                (hiker_id, trail_id),
            )
            conn.commit()
        conn.close()
        return jsonify({"message": "Removed from wishlist"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
