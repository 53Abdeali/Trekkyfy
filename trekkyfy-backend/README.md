# Trekkyfy Backend

Backend service for Trekkyfy.

## Current State

- Framework: Flask + Flask-SocketIO
- ORM: SQLAlchemy
- Database: configured through `DATABASE_URL`

## Run Locally (Current Baseline)

```bash
cd trekkyfy-backend
pip install -r requirements.txt
python app.py
```

Default port is `10000` unless overridden by `PORT`.

## Configuration

Backend reads configuration from environment variables (see root `.env.example`):

- App/Auth: `SECRET_KEY`, `JWT_SECRET_KEY`, `JWT_ACCESS_TOKEN_EXPIRES_HOURS`
- DB: `DATABASE_URL`
- Mail: `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- CORS: `FRONTEND_ORIGINS`, `SOCKET_CORS_ALLOWED_ORIGINS`

## Upcoming Changes

This service will be migrated to:

- FastAPI
- PostgreSQL + Alembic
- `uv`-managed dependencies and toolchain
- Docker-first development and testing workflow
