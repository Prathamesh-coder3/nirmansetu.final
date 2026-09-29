# NIRMAANSETU — VERCEL FULL-STACK DEPLOYMENT GUIDE

This document explains how to deploy **NirmaanSetu** to Vercel using the **Single GitHub Repository + Single Vercel Project** architecture.

---

## 🏗️ Deployment Architecture

```
                    GITHUB
                       │
                       │ (Push 1 Repository)
                       ▼
            https://github.com/USERNAME/NirmaanSetu
                       │
                       │ (Import 1 Vercel Project)
                       ▼
                  ONE VERCEL
                    PROJECT
                       │
              ┌────────┴────────┐
              │                 │
            /*                /api/*
              │                 │
           FRONTEND          BACKEND
       (React Vite SPA)   (Java 21 Spring Boot)
        frontend/dist      backend/Dockerfile.vercel
```

- **No separate Git repositories** needed for frontend and backend.
- **No separate Vercel projects** needed.
- Frontend and backend live on the **same domain** (e.g. `https://your-nirmaansetu.vercel.app`).
- The frontend makes relative API requests to `/api/...`, completely eliminating CORS configuration issues in production.

---

## 📋 Prerequisites

1. **GitHub Account**: To host the unified repository.
2. **Vercel Account**: (Pro or Hobby with Container Services support).
3. **Database** (Optional for production persistence): PostgreSQL database (e.g. Neon, Supabase, or AWS RDS). *Note: An embedded H2 database is included by default for instant out-of-the-box demo deployment if external database credentials are not provided.*

---

## 1️⃣ STEP 1: Push Repository to GitHub

Open terminal at the project root (`NirmaanSetu/`):

```bash
# Check that you are in the project root
cd path/to/NirmaanSetu

# Initialize Git if not already done
git init

# Stage all files (respects .gitignore)
git add .

# Create initial commit
git commit -m "NirmaanSetu: Single repo monorepo for Vercel deployment"

# Set default branch
git branch -M main

# Link to your remote GitHub repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# Push to GitHub
git push -u origin main
```

> **IMPORTANT**: Make sure there are NO nested `.git` folders inside `frontend/` or `backend/`. Only the root repository must have a `.git` folder.

---

## 2️⃣ STEP 2: Import into Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`YOUR_REPOSITORY_NAME`).
4. **Project Configuration Settings**:
   - **Framework Preset**: Leave as default or `Other` (the root `vercel.json` defines services automatically).
   - **Root Directory**: Keep `./` (do **NOT** set this to `frontend` or `backend`).
   - **Build and Output Settings**: Controlled by `vercel.json`.

---

## 3️⃣ STEP 3: Configure Environment Variables in Vercel

Under **Settings > Environment Variables** in your Vercel Project, you can configure the following:

### Backend Variables

| Variable | Recommended / Default Value | Purpose |
|---|---|---|
| `PORT` | *(Injected automatically by Vercel)* | Dynamic container listening port |
| `SPRING_PROFILES_ACTIVE` | `h2` *(or `prod` for PostgreSQL)* | Database profile |
| `DEMO_MODE` | `true` | Pre-populates demo users, jobs, & credentials |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256-bit secret key for signing JWTs |
| `JWT_EXPIRATION_MS` | `3600000` | Token validity duration in milliseconds |

### Optional: External PostgreSQL Configuration (for Production)
If using an external PostgreSQL database (such as Supabase, Neon, or Railway):
```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/nirmaansetu
SPRING_DATASOURCE_USERNAME=your_db_username
SPRING_DATASOURCE_PASSWORD=your_db_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

### Frontend Variables

| Variable | Recommended Value | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base path for frontend API calls (same-origin) |

---

## 4️⃣ STEP 4: Deploy & Verify

Click **Deploy**.

Vercel will build both services defined in `vercel.json`:
1. **Frontend Service**: Runs `npm run build` in `frontend/` to produce `frontend/dist`.
2. **Backend Service**: Builds the multi-stage container image using `backend/Dockerfile.vercel`.

### Verification Endpoints

Once deployment succeeds (e.g. at `https://your-nirmaansetu.vercel.app`):

1. **Verify Backend Health**:
   ```bash
   curl https://your-nirmaansetu.vercel.app/api/health
   ```
   **Expected Response**:
   ```json
   {
     "status": "UP",
     "application": "NirmaanSetu",
     "version": "1.0.0",
     "message": "NirmaanSetu Backend is running"
   }
   ```

2. **Verify Frontend UI**:
   - Open `https://your-nirmaansetu.vercel.app/` in your browser.
   - The landing page and login modal will appear.
   - Test client-side routing by refreshing `https://your-nirmaansetu.vercel.app/worker` or `https://your-nirmaansetu.vercel.app/login` (SPA rewrite handles direct deep links).

3. **Verify Full-Stack Authentication**:
   - Click **Quick Demo Login** on the login page or enter demo credentials:
     - Worker: `ramesh.kumar` / `NirmaanSetu@2024`
     - Government: `govt.pune` / `NirmaanSetu@2024`
     - Project Agency: `agency.mhada` / `NirmaanSetu@2024`
     - Training Organization: `training.itiPune` / `NirmaanSetu@2024`
     - Admin: `admin` / `NirmaanSetu@2024`
   - Notice that the request goes to `/api/auth/login` on the same domain, authenticates against the Spring Boot backend, and redirects to the appropriate dashboard seamlessly.

---

## 🔍 How `vercel.json` Works

The repository uses Vercel Services to run the full-stack monorepo:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "frontend": {
      "root": "frontend/",
      "framework": "vite",
      "buildCommand": "npm run build",
      "outputDirectory": "dist"
    },
    "backend": {
      "root": "backend/",
      "runtime": "container",
      "entrypoint": "Dockerfile.vercel"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": {
        "service": "backend"
      }
    },
    {
      "source": "/(.*)",
      "destination": {
        "service": "frontend"
      }
    }
  ]
}
```

- Any request starting with `/api/` is proxied to the `backend` container service.
- All other requests are routed to the `frontend` Vite static service.

---

## 💻 Local Development Workflow

To work locally without Docker:

```bash
# Terminal 1 - Backend (Spring Boot)
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend (Vite)
cd frontend
npm install
npm run dev
```

The frontend Vite server runs on `http://localhost:5173` and proxies `/api` to `http://localhost:8080`.
