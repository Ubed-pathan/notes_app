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

### Quick start (Docker)
1. Copy `.env.example` to `.env` files in frontend and backend as instructed.
2. Run Docker Compose at repo root to start MongoDB and backend.

## Monorepo Structure
- `frontend/` – React app
- `backend/` – API server

## Scripts
- See each package `package.json`.

## Deployment
- Deploy backend to any Node host (Render, Railway, Azure, etc.).
- Deploy frontend to Vercel/Netlify.

