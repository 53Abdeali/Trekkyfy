# Trekkyfy Backend

Backend service for Trekkyfy.

## Current State

- Framework: Flask + Flask-SocketIO
- ORM: SQLAlchemy
- Database: configured through `DATABASE_URL`
- Package manager baseline: `uv` + `pyproject.toml`

## Run Locally (uv)

```bash
cd trekkyfy-backend
uv sync --all-groups
uv run python app.py
```

Default port is `10000` unless overridden by `PORT`.

## Quality Commands

```bash
cd trekkyfy-backend
uv run ruff format --check config.py tests
uv run ruff check config.py tests
uv run mypy config.py tests
uv run pytest --cov=config --cov-report=term-missing
```

## Configuration

Backend reads configuration from environment variables (see root `.env.example`):

- App/Auth: `SECRET_KEY`, `JWT_SECRET_KEY`, `JWT_ACCESS_TOKEN_EXPIRES_HOURS`
- DB: `DATABASE_URL`
- Mail: `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- CORS: `FRONTEND_ORIGINS`, `SOCKET_CORS_ALLOWED_ORIGINS`

## Tests

Initial backend test scaffolding is in `trekkyfy-backend/tests/`.

- `test_config.py` validates environment parsing helpers

## Upcoming Changes

This service will be migrated to:

- FastAPI
- PostgreSQL + Alembic
- Docker-first development and testing workflow
