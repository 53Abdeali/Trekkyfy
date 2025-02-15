from flask import Blueprint, request, jsonify  # type: ignore
import pymysql.cursors  # type: ignore
import pymysql #type: ignore

explore_trek_bp = Blueprint("explore", __name__)

def get_db_connection():
    connection = pymysql.connect(
        host= "mysql-21f3bc70-aliabdealifakhri53-78d7.i.aivencloud.com",
        user= "avnadmin",
        password= "AVNS_P-7RDq_tkUVMeTbEKnV",
        database= "trekkyfy",
        port= 14791,
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection


@explore_trek_bp.route('/explore', methods=['GET'])
def explore():
    state = request.args.get('state', '')
    difficulty = request.args.get('difficulty', '')
    max_duration = request.args.get('max_duration', '')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    offset = (page - 1) * limit

    query = "SELECT * FROM trails_and_treks WHERE 1=1"
    params = []

    if state:
        query += " AND state LIKE %s"
        params.append(f"%{state}%")
    if difficulty:
        query += " AND difficulty_level = %s"
        params.append(difficulty)
    if max_duration:
        query += " AND duration_days <= %s"
        params.append(max_duration)

    query += " LIMIT %s OFFSET %s"
    params.extend([limit, offset])

    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(query, params)
            trails = cursor.fetchall()
        conn.close()
        return jsonify(trails)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500