import json
import random
import pandas as pd
from sqlalchemy import create_engine, text
from sklearn.neighbors import NearestNeighbors
from flask import Blueprint, jsonify, request

# Create SQLAlchemy engine (adjust connection string as needed)
engine = create_engine(
    "mysql+pymysql://avnadmin:AVNS_P-7RDq_tkUVMeTbEKnV@mysql-21f3bc70-aliabdealifakhri53-78d7.i.aivencloud.com:14791/trekkyfy"
)

query = text(
    """
    SELECT hiker_id, trek_id, details
    FROM bookings
"""
)
df = pd.read_sql(query, engine)


def extract_rating(details_json):
    try:
        details = json.loads(details_json)
        return details.get("rating", 0)
    except Exception:
        return 0


df["rating"] = df["details"].apply(extract_rating)
pivot_table = df.pivot_table(
    index="hiker_id", columns="trek_id", values="rating"
).fillna(0)

knn = NearestNeighbors(metric="cosine", algorithm="brute")
if not pivot_table.empty:
    knn.fit(pivot_table)

trek_rec_bp = Blueprint("trek_rec_bp", __name__)


@trek_rec_bp.route("/recommend_treks", methods=["GET"])
def recommend_treks_api():
    hiker_id = request.args.get("hiker_id")
    if not hiker_id:
        return jsonify({"error": "Missing hiker_id"}), 400

    if hiker_id not in pivot_table.index:
        random_query = text("SELECT * FROM treks ORDER BY RAND() LIMIT 3")
        with engine.connect() as conn:
            random_trails = pd.read_sql(random_query, conn)
        recommended = random_trails.to_dict(orient="records")
        return jsonify({"hiker_id": hiker_id, "recommended_treks": recommended})

    hiker_vector = pivot_table.loc[hiker_id].values.reshape(1, -1)
    distances, indices = knn.kneighbors(hiker_vector, n_neighbors=10)

    similar_hikers = pivot_table.index[indices.flatten()[1:]]
    similar_ratings = pivot_table.loc[similar_hikers]
    mean_ratings = similar_ratings.mean(axis=0)
    hiker_rated = pivot_table.loc[hiker_id]
    unrated_treks = mean_ratings[hiker_rated == 0]
    sorted_treks = unrated_treks.sort_values(ascending=False)
    top_trek_ids = sorted_treks.head(6).index.tolist()
    random.shuffle(top_trek_ids)
    recommended_trek_ids = top_trek_ids[:3]

    trek_query = text("SELECT * FROM treks WHERE id IN :ids")
    with engine.connect() as conn:
        recommended_trails = pd.read_sql(
            trek_query, conn, params={"ids": tuple(recommended_trek_ids)}
        )
    recommended = recommended_trails.to_dict(orient="records")

    return jsonify({"hiker_id": hiker_id, "recommended_treks": recommended})
