# Trekkyfy Backend

Backend service for Trekkyfy.

## Current State

- Primary app runtime: FastAPI (`main.py`)
- Legacy API compatibility: existing Flask app mounted through WSGI during migration
- ORM: SQLAlchemy
- Database: configured through `DATABASE_URL`
- Package manager baseline: `uv` + `pyproject.toml`

## Run Locally (uv)

```bash
cd trekkyfy-backend
uv sync --all-groups
uv run uvicorn main:app --host 0.0.0.0 --port 10000
```

## Run with Docker

From repo root:

```bash
docker compose up --build backend postgres
```

Backend will be available at `http://localhost:10000`.

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

## Migration Note

`main.py` exposes `/healthz` as FastAPI native health check and mounts legacy Flask routes while we port endpoints incrementally to native FastAPI routers.
