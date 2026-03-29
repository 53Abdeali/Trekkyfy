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

## Quick Start

1. Copy env file:

```bash
cp .env.example .env
```

2. Start full stack (Postgres + backend + frontend):

```bash
docker compose up --build
```

3. Access services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:10000`
- PostgreSQL: `localhost:5432`

## Local Run Without Docker

Backend:

```bash
cd trekkyfy-backend
uv sync --all-groups
uv run python app.py
```

Frontend:

```bash
cd trekkyfy-frontend
npm install
npm run dev
```

## Environment Variables

All shared environment variables are documented in `.env.example`.

- Backend secrets and DB settings: `SECRET_KEY`, `JWT_SECRET_KEY`, `DATABASE_URL`
- Docker DB settings: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- Mail settings: `MAIL_*`
- Cloudinary settings: `CLOUDINARY_*`
- Frontend API base: `NEXT_PUBLIC_API_BASE_URL`
