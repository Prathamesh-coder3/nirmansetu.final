# NIRMAANSETU (निर्माणसेतु)
### Workforce Intelligence, Skilling & Employment Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment%20Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

---

## 🏛️ Monorepo Architecture Overview

NirmaanSetu is configured as a **single unified monorepo** structured for deployment to **one single Vercel project** using Vercel Services:

```
                    GITHUB
                       │
                       │
                ONE NirmaanSetu REPO
                       │
              ┌────────┴────────┐
              │                 │
          frontend/          backend/
          React/Vite        Spring Boot
              │                 │
              └────────┬────────┘
                       │
                  ONE VERCEL
                    PROJECT
                       │
              ┌────────┴────────┐
              │                 │
            /*                /api/*
              │                 │
           FRONTEND          BACKEND
          (Vite SPA)     (Java 21 Container)
```

- **One GitHub Repository**: Both frontend and backend live in this single repository.
- **One Vercel Project**: The repository root is imported directly into Vercel.
- **Same-Origin API Routing**: Requests to `/api/*` route directly to the backend container service, while all other paths (`/*`) route to the frontend Vite application. No cross-origin CORS barriers in production.

---

## 📂 Repository Structure

```
NirmaanSetu/
├── vercel.json                  # Root Vercel Services & Rewrites configuration
├── README.md                    # Project documentation
├── DEPLOY_VERCEL.md             # Complete step-by-step Vercel deployment guide
├── .gitignore                   # Ignores target/, node_modules/, dist/, .env
│
├── frontend/                    # Frontend React + TypeScript + Vite application
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── .env.example
│   ├── public/                  # Static assets & public files
│   └── src/
│       ├── App.tsx              # Main entry with routing & role guards
│       ├── api.ts              # Central API client (relative /api base)
│       ├── components/          # Reusable UI components & modals
│       ├── context/             # Auth, Language, Notification contexts
│       ├── types/               # TypeScript definitions
│       └── i18n/                # Multilingual translations (EN, MR, HI)
│
└── backend/                     # Backend Spring Boot 3.3.4 (Java 21) application
    ├── pom.xml                  # Maven build configuration
    ├── Dockerfile.vercel        # Multi-stage production container build
    ├── .env.example
    └── src/
        └── main/
            ├── java/com/nirmaansetu/
            │   ├── NirmaanSetuApplication.java
            │   ├── config/      # Security, CORS, WebMvc configuration
            │   ├── controller/  # REST API controllers (/api/*)
            │   ├── model/       # JPA Entities & Enums
            │   ├── repository/  # Spring Data JPA repositories
            │   ├── security/    # JWT filter, provider, and UserDetailsService
            │   ├── service/     # Business logic & demo seed data
            │   └── util/        # Port finder & build utilities
            └── resources/
                ├── application.properties # Server port (${PORT:8080}) & profiles
                ├── db/migration/          # Flyway SQL migrations
                └── data-h2.sql            # Seed data
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Java 21** JDK installed (`java -version`)
- **Maven 3.8+** (`mvn -v`)
- **Node.js 18+** & **npm 9+** (`node -v`, `npm -v`)

### 1. Run Backend (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*Backend starts on `http://localhost:8080`. Seed data and demo users are pre-loaded.*

### 2. Run Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Frontend starts on `http://localhost:5173`. Vite proxies all `/api/*` calls directly to `http://localhost:8080`.*

---

## 🚢 Deploying to Vercel

See [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) for the complete, detailed deployment guide.

Summary:
1. Push this repository to GitHub as **one repository**:
   ```bash
   git init
   git add .
   git commit -m "NirmaanSetu: Monorepo for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/NirmaanSetu.git
   git push -u origin main
   ```
2. Import the repository in Vercel.
3. Keep the root directory as `./` (do not change root to frontend or backend).
4. Vercel automatically detects `vercel.json` and spins up:
   - **Frontend Service** (Vite build)
   - **Backend Service** (Java 21 Container via `Dockerfile.vercel`)
5. Direct routing:
   - Web App: `https://your-project.vercel.app/`
   - Health API: `https://your-project.vercel.app/api/health`
   - Login API: `https://your-project.vercel.app/api/auth/login`

---

## 👥 Supported Roles & Demo Accounts

| Role | Username | Password |
|---|---|---|
| **Worker** | `ramesh.kumar` | `NirmaanSetu@2024` |
| **Government** | `govt.pune` | `NirmaanSetu@2024` |
| **Project Agency** | `agency.mhada` | `NirmaanSetu@2024` |
| **Training Organization** | `training.itiPune` | `NirmaanSetu@2024` |
| **Admin** | `admin` | `NirmaanSetu@2024` |

---

## 🛡️ License & Credits
Built for Workforce Intelligence, Skilling, and Employment lifecycle management across infrastructure projects in India.
