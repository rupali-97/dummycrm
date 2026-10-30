# Clinic CRM

A complete Clinic CRM system built with **React.js**, **Node.js**, **Express.js**, and **MySQL**.

## Project Structure

```
clinic-crm/
├── backend/              # Node.js + Express REST API
│   ├── config/db.js      # MySQL connection pool
│   ├── controllers/      # Route controllers (CRUD logic)
│   ├── middleware/       # Auth (JWT) + validation middleware
│   ├── routes/           # REST route definitions
│   ├── utils/            # DB query helper
│   ├── server.js         # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/             # React.js SPA
│   ├── public/index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── context/AuthContext.js
│   │   ├── services/api.js
│   │   ├── components/   # Layout, Sidebar, Navbar, ProtectedRoute
│   │   └── pages/        # Login, Dashboard, Patients, Doctors, Appointments, Prescriptions, Billing, Reports
│   ├── package.json
│   └── .env.example
├── database/
│   └── database.sql      # Schema + sample data
└── README.md
```

## Modules

- **Authentication** — Login with JWT + bcrypt password hashing
- **Patients** — Full CRUD
- **Doctors** — Full CRUD
- **Appointments** — Full CRUD (linked to patients & doctors)
- **Prescriptions** — Full CRUD (linked to appointments, patients, doctors)
- **Billing** — Full CRUD (linked to patients & appointments)
- **Reports** — Dashboard stats, charts by status, recent appointments

## Prerequisites (Ubuntu)

- Node.js (v18+) and npm
- MySQL Server 8.0+

Install prerequisites:

```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server
sudo mysql_secure_installation
```

Verify versions:

```bash
node --version
npm --version
mysql --version
```

## Database Setup

1. Log into MySQL:

```bash
sudo mysql -u root -p
```

2. Create the database and a dedicated user (optional but recommended):

```sql
CREATE DATABASE clinic_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'clinic_user'@'localhost' IDENTIFIED BY 'clinic_password';
GRANT ALL PRIVILEGES ON clinic_crm.* TO 'clinic_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. Import the schema and sample data:

```bash
mysql -u root -p clinic_crm < database/database.sql
```

(Or using the dedicated user: `mysql -u clinic_user -p clinic_crm < database/database.sql`)

## Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and set DB_PASSWORD to your MySQL root/user password
npm install
```

Edit `backend/.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=clinic_crm
JWT_SECRET=change_this_to_a_random_secret
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm start        # production
# or
npm run dev      # with nodemon (development)
```

Backend runs on `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Frontend runs on `http://localhost:3000` and proxies API calls to `http://localhost:5000`.

## Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| dr.smith | admin123 | doctor |
| reception | admin123 | receptionist |

## Running Everything Locally (One-Terminal Summary)

```bash
# 1. Install MySQL + Node if not present
sudo apt update && sudo apt install -y nodejs npm mysql-server

# 2. Setup database
sudo mysql -u root -p clinic_crm < clinic-crm/database/database.sql

# 3. Backend
cd clinic-crm/backend
cp .env.example .env
nano .env   # set DB_PASSWORD
npm install
npm start &

# 4. Frontend
cd clinic-crm/frontend
cp .env.example .env
npm install
npm start
```

Open your browser at `http://localhost:3000`.

## API Endpoints

All endpoints require JWT (except `POST /api/auth/login` and `POST /api/auth/register`).

- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `GET /api/auth/me` — Current user
- `GET/POST/PUT/DELETE /api/patients` — Patients CRUD
- `GET/POST/PUT/DELETE /api/doctors` — Doctors CRUD
- `GET/POST/PUT/DELETE /api/appointments` — Appointments CRUD
- `GET/POST/PUT/DELETE /api/prescriptions` — Prescriptions CRUD
- `GET/POST/PUT/DELETE /api/billing` — Billing CRUD
- `GET /api/reports/dashboard-stats` — Dashboard metrics
- `GET /api/reports/appointments-by-status` — Appointment status breakdown
- `GET /api/reports/billing-by-status` — Billing status breakdown
- `GET /api/reports/recent-appointments` — Recent appointments list

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT stateless authentication
- Protected routes with role-based authorization
- Parameterized queries (no SQL injection)
- Input validation via express-validator
- CORS enabled
