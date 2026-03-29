from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.wsgi import WSGIMiddleware

from app import app as legacy_flask_app
from config import FRONTEND_ORIGINS

app = FastAPI(
    title="Trekkyfy API",
    description="FastAPI transition app with legacy Flask API mounted during migration.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "trekkyfy-fastapi"}


# Keep existing Flask endpoints available while routes are ported to FastAPI.
app.mount("/", WSGIMiddleware(legacy_flask_app))
