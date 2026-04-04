# Trekkyfy Frontend

Next.js frontend for Trekkyfy user journeys, including registration, guide discovery, wishlist, and booking.

## Run Locally

```bash
cd trekkyfy-frontend
npm install
npm run dev
```

## Run with Docker

From repo root:

```bash
docker compose up --build frontend
```

Frontend will be available at `http://localhost:3000`.

## Environment

Frontend API base URL should come from:

- `NEXT_PUBLIC_API_BASE_URL`

Current code still contains hardcoded production API URLs in some places. This will be normalized in a dedicated migration PR.

## Upcoming Changes

- normalize all API calls to env-driven base URL
- align auth/cookie and CORS behavior with migrated FastAPI backend
- add frontend quality and CI checks aligned with monorepo standards
