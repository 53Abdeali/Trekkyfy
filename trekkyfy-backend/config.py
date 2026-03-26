import os
from itsdangerous import URLSafeTimedSerializer


def _as_bool(value: str, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _as_int(value: str, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _as_list(value: str) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-key-change-me")
JWT_ACCESS_TOKEN_EXPIRES_HOURS = _as_int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS"), 10
)

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///trekkyfy.db")
SQLALCHEMY_TRACK_MODIFICATIONS = False

MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = _as_int(os.getenv("MAIL_PORT"), 587)
MAIL_USE_TLS = _as_bool(os.getenv("MAIL_USE_TLS"), True)
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")

FRONTEND_ORIGINS = _as_list(
    os.getenv(
        "FRONTEND_ORIGINS", "https://trekkyfy.vercel.app,http://localhost:3000"
    )
)
SOCKET_CORS_ALLOWED_ORIGINS = _as_list(
    os.getenv(
        "SOCKET_CORS_ALLOWED_ORIGINS",
        "https://trekkyfy.vercel.app,http://localhost:3000,*",
    )
)

TOKEN_SALT = os.getenv("TOKEN_SALT", "trekkyfy-reset-password")
s = URLSafeTimedSerializer(SECRET_KEY)
salt = TOKEN_SALT
