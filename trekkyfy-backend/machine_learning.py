import json
import random

import pandas as pd
from flask import Blueprint, jsonify, request
from sklearn.neighbors import NearestNeighbors
from sqlalchemy import bindparam, text

from extensions import db


trek_rec_bp = Blueprint("trek_rec_bp", __name__)


def _load_ratings_df() -> pd.DataFrame:
    query = text(
        """
        SELECT hiker_id, trek_id, details
        FROM bookings
        """
    )
    result = db.session.execute(query)
    rows = [dict(row) for row in result.mappings().all()]
    return pd.DataFrame(rows)


def _extract_rating(details_json: str) -> int:
    try:
        details = json.loads(details_json)
        return int(details.get("rating", 0))
    except Exception:
        return 0


def _random_treks(limit: int = 3) -> list[dict]:
    query = text("SELECT * FROM trails_and_treks ORDER BY RANDOM() LIMIT :limit")
    result = db.session.execute(query, {"limit": limit})
    return [dict(row) for row in result.mappings().all()]


@trek_rec_bp.route("/recommend_treks", methods=["GET"])
def recommend_treks_api():
    hiker_id = request.args.get("hiker_id")
    if not hiker_id:
        return jsonify({"error": "Missing hiker_id"}), 400

    try:
        df = _load_ratings_df()
        if df.empty:
            return jsonify({"hiker_id": hiker_id, "recommended_treks": _random_treks(3)})

        df["rating"] = df["details"].apply(_extract_rating)
        pivot_table = df.pivot_table(
            index="hiker_id", columns="trek_id", values="rating"
        ).fillna(0)

        if hiker_id not in pivot_table.index:
            return jsonify({"hiker_id": hiker_id, "recommended_treks": _random_treks(3)})

        knn = NearestNeighbors(metric="cosine", algorithm="brute")
        knn.fit(pivot_table)

        n_neighbors = min(10, len(pivot_table))
        if n_neighbors <= 1:
            return jsonify({"hiker_id": hiker_id, "recommended_treks": _random_treks(3)})

        hiker_vector = pivot_table.loc[hiker_id].values.reshape(1, -1)
        _, indices = knn.kneighbors(hiker_vector, n_neighbors=n_neighbors)

        similar_hikers = pivot_table.index[indices.flatten()[1:]]
        similar_ratings = pivot_table.loc[similar_hikers]
        mean_ratings = similar_ratings.mean(axis=0)
        hiker_rated = pivot_table.loc[hiker_id]
        unrated_treks = mean_ratings[hiker_rated == 0]
        sorted_treks = unrated_treks.sort_values(ascending=False)
        top_trek_ids = sorted_treks.head(6).index.tolist()

        if not top_trek_ids:
            return jsonify({"hiker_id": hiker_id, "recommended_treks": _random_treks(3)})

        random.shuffle(top_trek_ids)
        recommended_trek_ids = top_trek_ids[:3]

        trek_query = (
            text("SELECT * FROM trails_and_treks WHERE id IN :ids")
            .bindparams(bindparam("ids", expanding=True))
        )
        result = db.session.execute(trek_query, {"ids": recommended_trek_ids})
        recommended = [dict(row) for row in result.mappings().all()]

        return jsonify({"hiker_id": hiker_id, "recommended_treks": recommended})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
