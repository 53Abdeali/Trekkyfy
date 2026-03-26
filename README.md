# Trekkyfy Monorepo

Trekkyfy is a monorepo containing the backend API service and Next.js frontend for trek discovery, guide matching, and booking workflows.

## Repository Structure

- `trekkyfy-backend/`: Backend API service (currently Flask, planned migration to FastAPI)
- `trekkyfy-frontend/`: Next.js frontend

## Current Migration Program

This repository is being reformed in phases to:

- migrate backend from Flask to FastAPI
- migrate database from MySQL to PostgreSQL
- standardize Python tooling with `uv`
- add Dockerized local development and CI quality gates

## Quick Start (Current Baseline)

1. Copy env file:

```bash
cp .env.example .env
```

2. Backend (current Flask baseline):

```bash
cd trekkyfy-backend
pip install -r requirements.txt
python app.py
```

3. Frontend:

```bash
cd trekkyfy-frontend
npm install
npm run dev
```

## Environment Variables

All shared environment variables are documented in `.env.example`.

- Backend secrets and DB settings: `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`
- Mail settings: `MAIL_*`
- Cloudinary settings: `CLOUDINARY_*`
- Frontend API base: `NEXT_PUBLIC_API_BASE_URL`

## Planned Docs Expansion

As migration PRs land, this README will be expanded with:

- Docker Compose full-stack setup
- `uv` workflow and lockfile usage
- FastAPI and Alembic commands
- CI quality gates and coverage requirements
