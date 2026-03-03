# PVPSIT QR Event Manager

Full-stack QR-based event management system.

## Project Structure

- `backend/QREventManager` - Spring Boot API (Java + MySQL)
- `frontend` - React app

## 1. Setup for Collaborators (with GitHub access)

Use this flow if your friend is added as a collaborator and needs to develop/contribute.

### Step 1: Clone repository

```bash
git clone <your-repo-url>
cd "4th Year Project"
```

### Step 2: Prerequisites

- Java 21
- Node.js 18+ and npm
- MySQL 8+
- Git

### Step 3: Create environment files

Because `.env` is in `.gitignore`, each collaborator must create local env files manually.

1. Backend env:
```powershell
cd backend/QREventManager
copy .env.example .env
```
```bash
cd backend/QREventManager
cp .env.example .env
```

2. Frontend env:
```powershell
cd ../../frontend
copy .env.example .env
```
```bash
cd ../../frontend
cp .env.example .env
```

3. Fill values:
- In `backend/QREventManager/.env`, set database, JWT, and Razorpay keys.
- In `frontend/.env`, set API base URL.
- Share real secret values with collaborators via a secure channel (never in GitHub commits).

### Step 4: Create MySQL database

```sql
CREATE DATABASE event_db;
```

### Step 5: Run backend

```bash
cd backend/QREventManager
./mvnw spring-boot:run
```
```powershell
cd backend/QREventManager
.\mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8080`.

### Step 6: Run frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`.

### Step 7: Collaborator workflow

```bash
git checkout -b feature/<feature-name>
# make changes
git add .
git commit -m "feat: <message>"
git push origin feature/<feature-name>
```

Then open a Pull Request on GitHub.

## 2. Setup for Normal Users (run project only, no contribution)

Use this flow if someone just wants to run the project locally.

### Step 1: Download code

Choose one:
- Clone with Git:
```bash
git clone <your-repo-url>
```
- Or download ZIP from GitHub and extract.

### Step 2: Install prerequisites

- Java 21
- Node.js 18+ and npm
- MySQL 8+

### Step 3: Configure env files

Create:
- `backend/QREventManager/.env` (from `.env.example`)
- `frontend/.env` (from `.env.example`)

Update keys/values for local machine.

### Step 4: Create database

```sql
CREATE DATABASE event_db;
```

### Step 5: Start backend, then frontend

Backend:
```bash
cd backend/QREventManager
./mvnw spring-boot:run
```
```powershell
cd backend/QREventManager
.\mvnw.cmd spring-boot:run
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## 3. Environment Variables

### Backend (`backend/QREventManager/.env`)

- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### Frontend (`frontend/.env`)

- `REACT_APP_API_BASE_URL` (default: `http://localhost:8080/api`)

## 4. Important Notes

- Never commit real `.env` files.
- Commit only `.env.example` files with placeholder values.
- If secrets are exposed accidentally, rotate them immediately.
