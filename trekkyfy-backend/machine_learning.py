import json
import random
import pandas as pd
from sqlalchemy import create_engine, text
from sklearn.neighbors import NearestNeighbors
from flask import Blueprint, jsonify, make_response, request # type: ignore

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
knn.fit(pivot_table)


def recommend_treks(hiker_id, n_recommendations=3):
    if hiker_id not in pivot_table.index:
        return f"Hiker {hiker_id} not found in the dataset."

    hiker_vector = pivot_table.loc[hiker_id].values.reshape(1, -1)

    distances, indices = knn.kneighbors(hiker_vector, n_neighbors=10)
    similar_hikers = pivot_table.index[indices.flatten()[1:]]

    similar_ratings = pivot_table.loc[similar_hikers]
    mean_ratings = similar_ratings.mean(axis=0)

    hiker_rated = pivot_table.loc[hiker_id]
    unrated_treks = mean_ratings[hiker_rated == 0]

    sorted_treks = unrated_treks.sort_values(ascending=False)

    top_treks = sorted_treks.head(n_recommendations * 2).index.tolist()
    random.shuffle(top_treks)
    recommendations = top_treks[:n_recommendations]

    return recommendations

trek_rec_bp = Blueprint("Trek Recommendation", __name__)

@trek_rec_bp.route("trek_recommendations", methods=["GET"])
def recommend_treks_api():
    hiker_id = request.args.get('hiker_id')
    if not hiker_id:
        return jsonify({"error": "Missing hiker_id"}), 400

    recommendations = recommend_treks(hiker_id)
    return jsonify({"hiker_id": hiker_id, "recommended_treks": recommendations})
