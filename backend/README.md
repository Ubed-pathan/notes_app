# Backend (API)

## Env
Copy `.env.example` to `.env` and fill values.

## Run locally
- Start MongoDB: use Docker compose at repo root or a local Mongo instance.
- Install deps and run dev server.

## Endpoints
- `POST /api/auth/request-otp` – send OTP to email
- `POST /api/auth/verify-otp` – verify and login, returns JWT
- `POST /api/auth/google` – exchange Google id_token for JWT
- `GET /api/notes` – list notes (auth)
- `POST /api/notes` – create note (auth)
- `DELETE /api/notes/:id` – delete note (auth)

Authorization: `Authorization: Bearer <token>`
