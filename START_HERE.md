# NirmaanSetu — Single Splash + Login Fixed Version

## Run in Antigravity / VS Code

Open this folder as the project root, then run:

```bash
cd backend
mvn spring-boot:run
```

The application starts on the first available port beginning at `8080`.
If `8080` is busy, it automatically selects `8081`, `8082`, etc.

The browser is opened automatically when startup succeeds.

## Database

Development mode uses an **H2 in-memory database** with Flyway migrations and demo seed data.
This intentionally avoids the previous file-lock problem (`SQL State 90020`) caused by
`nirmaansetu-dev.mv.db` being held by another Java process.

Every fresh launch loads the complete demo dataset again. No local `.mv.db` file is required.

## Frontend

The React production bundle is already in `frontend/dist`. Maven copies it into the
Spring Boot static resources during a clean launch.

If you change the React source, rebuild it separately:

```bash
cd frontend
npm install
npm run build
```

Then return to the project root and run Maven again.

## Splash screen

There is one startup splash screen. The main router is mounted only after the splash
completes, so the application does not render a second/underlying splash or duplicate
startup UI.

## Demo login

All seeded demo accounts use:

```text
Password: NirmaanSetu@2024
```

Username or email can be used to sign in. Usernames are case-insensitive and surrounding spaces are ignored.

### Admin
- `admin`
- `admin@nirmaansetu.mah.gov.in`

### Government
- `govt.pune` / `seei.pune@mah.gov.in`

### Project Agencies
- `agency.mhada` / `projects@mhada-infra.com`

### Training Organizations
- `training.itiPune` / `director@iti-pune.edu.in`

### Workers
- `ramesh.kumar` / `ramesh.kumar@gmail.com`

## Login fix

All 15 seeded demo accounts use the same verified BCrypt password:

```text
NirmaanSetu@2024
```

Login accepts either username or email, ignores surrounding spaces, and treats the identifier case-insensitively.

The training demo mapping now uses the real seeded account `training.itiPune`. The login page shows exactly one demo account for Government, Project Agency, Training Organization, and Worker, plus one Admin account. Demo buttons authenticate against the backend so protected API calls continue to work.
