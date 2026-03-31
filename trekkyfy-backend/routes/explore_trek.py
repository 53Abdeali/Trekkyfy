from flask import Blueprint, request, jsonify  # type: ignore
from sqlalchemy import text
from extensions import db

explore_trek_bp = Blueprint("explore", __name__)


@explore_trek_bp.route('/explore', methods=['GET'])
def explore():
    state = request.args.get('state', '')
    difficulty = request.args.get('difficulty', '')
    max_duration = request.args.get('max_duration', '')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    offset = (page - 1) * limit

    query = "SELECT * FROM trails_and_treks WHERE 1=1"
    params = {}

    if state:
        query += " AND state LIKE :state"
        params["state"] = f"%{state}%"
    if difficulty:
        query += " AND difficulty_level = :difficulty"
        params["difficulty"] = difficulty
    if max_duration:
        query += " AND duration_days <= :max_duration"
        params["max_duration"] = max_duration

    query += " LIMIT :limit OFFSET :offset"
    params["limit"] = limit
    params["offset"] = offset

    try:
        result = db.session.execute(text(query), params)
        trails = [dict(row) for row in result.mappings().all()]
        return jsonify(trails)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
