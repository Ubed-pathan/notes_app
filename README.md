# Note App

A full-stack note-taking application with OTP and Google authentication. Built with React + TypeScript (frontend) and Node.js + Express + TypeScript + MongoDB (backend). Includes JWT auth and notes CRUD.

## Features
- Email + OTP signup/login
- Google OAuth login
- JWT-protected Notes: create, list, delete
- Mobile-first UI following the provided Figma
- TypeScript end-to-end
- Ready for local dev with Docker Compose

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, TypeScript, Mongoose, JWT, Zod
- DB: MongoDB (Docker)

## Setup
See `frontend/README.md` and `backend/README.md` for app-specific steps.

### Quick start (local)
- Prereqs: Node 18+, MongoDB running locally (or Docker), Google OAuth Client ID (optional).
- Backend:
	- Copy `backend/.env.example` to `backend/.env` and set values.
	- In one terminal: `cd backend && npm i && npm run dev`.
- Frontend:
	- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` and optionally `VITE_GOOGLE_CLIENT_ID`.
	- In another terminal: `cd frontend && npm i && npm run dev`.
	- Open http://localhost:5173

### Quick start (Docker for Mongo only)
If you have Docker, start MongoDB:
- `docker compose up -d mongo`
Then run backend and frontend as above.

## Monorepo Structure
- `frontend/` – React app
- `backend/` – API server

## Scripts
- See each package `package.json`.

## Deployment
- Backend: build and deploy Docker image or run `npm run build` and host `dist` on Node 18+.
- Frontend: deploy `frontend/dist` to Vercel/Netlify/Static hosting.

