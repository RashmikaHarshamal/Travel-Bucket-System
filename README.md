# Travel Bucket System

Full-stack app:
- Backend: Spring Boot + MongoDB
- Frontend: React (Vite)

## Quick start (recommended): Docker Compose file

1) Start everything:

`docker compose up --build`

2) Open the app:

`http://localhost:3000`

3) MongoDB Compass:

- Connect to `mongodb://localhost:27018`
- Database: `Travel_Bucket`
- Collection: `users`

Note: In Docker, Mongo is published as `27018` on your host.

## Local development (no Docker)

### Backend (Windows)

From PowerShell:

`cd backend`

`./mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"`

Backend API:
- `http://localhost:8081/api/v1/getusers`
- `POST http://localhost:8081/api/v1/login`

### Frontend

`cd frontend`

`npm install`

`npm run dev`

The dev server proxies `/api/v1/*` to `VITE_API_PROXY_TARGET` (see [frontend/.env](frontend/.env)).

## Troubleshooting login

### 1) Wrong ports / wrong Mongo instance

- If you use Docker Compose, Compass must connect to `localhost:27018` (not `27017`).
- If you run backend locally on Windows, it will use `localhost:27017` by default.

### 2) Backend running inside WSL can’t reach Windows MongoDB

If your backend runs in WSL but MongoDB runs on Windows bound to `127.0.0.1`, WSL will fail to connect and endpoints may return `500`.

Fix options:
- Run the backend on Windows (recommended).
- Or run MongoDB inside WSL / Docker and point Spring to that Mongo.

