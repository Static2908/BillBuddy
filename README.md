# BillBuddy

BillBuddy is an AI-powered utility bill analysis and anomaly explanation system.  
This repository contains:
- a React + Vite frontend for the dashboard experience
- a Spring Boot backend for bill data and APIs
- a MySQL schema reference for local setup

## Technology stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS (Vite plugin), Recharts, Lucide React
- **Backend:** Java 21, Spring Boot 3.3.x, Spring Web, Spring Data JPA, Validation, Security, MySQL Connector/J
- **Testing:** JUnit 5, Spring Boot Starter Test, H2 (test scope)

## Project structure

```text
BillBuddy/
├── backend/
├── database/
│   └── schema.sql
├── docs/
│   └── PROJECT_PLAN.md
└── frontend/
```

## Prerequisites

- **Node.js** 20+ and npm
- **Java** 21
- **MySQL** 8.x
- (Optional) Maven installed globally. Maven Wrapper is already included in `backend/`.

## MySQL setup

Start MySQL locally on `localhost:3306`.

Run these SQL commands (update the password value to your own secure password):

```sql
CREATE DATABASE IF NOT EXISTS billbuddy_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'billbuddy_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';
GRANT ALL PRIVILEGES ON billbuddy_db.* TO 'billbuddy_user'@'localhost';
FLUSH PRIVILEGES;
```

To create tables manually, run [schema.sql](./database/schema.sql).  
For local development, the backend currently uses `spring.jpa.hibernate.ddl-auto=update`.  
For production, use managed migrations instead of automatic schema updates.

## Environment variables

### Backend

Spring Boot does **not** load `.env` files by default. Set environment variables in your shell/IDE run configuration.

See [backend/.env.example](./backend/.env.example):

- `DB_URL` (defaulted in app config to `jdbc:mysql://localhost:3306/billbuddy_db`)
- `DB_USERNAME` (defaulted in app config to `billbuddy_user`)
- `DB_PASSWORD` (**required**, no hardcoded default)
- `JWT_SECRET` (**required**, at least 32 random UTF-8 bytes)
- `JWT_EXPIRATION_MS` (optional, defaults to `3600000`)

### Frontend

See [frontend/.env.example](./frontend/.env.example):

- `VITE_API_BASE_URL=http://localhost:8080`

Do not store secrets in Vite env variables because they are exposed to the browser.

## Run the backend

From `backend/`:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

Health endpoint: `http://localhost:8080/api/health`

Authentication is token-based:

- `POST /api/auth/register` creates a user and returns a bearer token.
- `POST /api/auth/login` authenticates a user and returns a bearer token.
- Send `Authorization: Bearer <token>` for bill and analytics endpoints.
- `GET /api/bills` and `GET /api/analytics/summary` provide the main authenticated data views.

Example PowerShell configuration:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/billbuddy_db"
$env:DB_USERNAME = "billbuddy_user"
$env:DB_PASSWORD = "<your-local-password>"
$env:JWT_SECRET = "<random-secret-at-least-32-bytes>"
.\mvnw.cmd spring-boot:run
```

Never commit real database credentials or JWT secrets.

## Run the frontend

From `frontend/`:

```powershell
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Run tests

From `backend/`:

```powershell
.\mvnw.cmd test
```

From `frontend/`:

```powershell
npm run build
```

## Troubleshooting

- **`DB_PASSWORD` missing:** set `DB_PASSWORD` in your environment before starting backend.
- **MySQL connection failed:** verify MySQL is running, credentials are correct, and `billbuddy_db` exists.
- **CORS issues from frontend:** ensure frontend runs on `http://localhost:5173` and backend on `http://localhost:8080`.
- **Frontend dependency errors:** run `npm install` again in `frontend/`.
