from flask import Blueprint, request, jsonify
import pymysql.cursors  # type: ignore
import pymysql  # type: ignore

wishlist_bp = Blueprint("wishlist", __name__)


def get_db_connection():
    return pymysql.connect(
        host="mysql-21f3bc70-aliabdealifakhri53-78d7.i.aivencloud.com",
        user="avnadmin",
        password="AVNS_P-7RDq_tkUVMeTbEKnV",
        database="trekkyfy",
        port=14791,
        cursorclass=pymysql.cursors.DictCursor,
    )


@wishlist_bp.route("/wishlist/<int:hiker_id>", methods=["GET"])
def get_wishlist(hiker_id):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT t.id, t.name 
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
def add_to_wishlist():
    data = request.json
    hiker_id = data.get("hiker_id")
    trail_id = data.get("trail_id")

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
        return jsonify({"message": "Added to wishlist"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@wishlist_bp.route("/wishlist/remove", methods=["POST"])
def remove_from_wishlist():
    data = request.json
    hiker_id = data.get("hiker_id")
    trail_id = data.get("trail_id")

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
