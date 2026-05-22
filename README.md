# ProjectFlow 🚀

A production-ready, full-stack **Project Management Web App** built with React, Node.js, Express, PostgreSQL, and Prisma. Features role-based access control, JWT authentication, and a modern dark-themed UI.

![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **JWT Authentication** — Signup, login, logout with bcrypt password hashing
- **Role-Based Access Control** — Admin and Member roles with middleware enforcement
- **Project Management** — Create, edit, delete projects; manage team members
- **Task Management** — Full CRUD, status/priority tracking, due dates, assignment
- **Overdue Detection** — Visual indicators for overdue tasks
- **Dashboard Analytics** — Admin team overview + member personal stats
- **Search & Filters** — Filter tasks by status, priority, project, or keyword
- **Responsive UI** — Dark-themed, modern design with Tailwind CSS

---

## 🏗 Tech Stack

| Layer      | Tech                              |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, Axios, Zustand |
| Backend    | Node.js, Express.js               |
| Database   | PostgreSQL                        |
| ORM        | Prisma                            |
| Auth       | JWT, bcryptjs                     |
| Deployment | Railway                           |

---

## 📁 Project Structure

```
projectflow/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── api/               # Axios instance + service functions
│   │   ├── components/
│   │   │   ├── auth/          # ProtectedRoute
│   │   │   ├── layout/        # Sidebar, AppLayout
│   │   │   └── ui/            # Shared UI components
│   │   ├── hooks/             # useFetch, useAsync
│   │   ├── pages/             # Route-level page components
│   │   ├── store/             # Zustand auth store
│   │   └── utils/             # Helpers, formatters
│   └── package.json
│
├── server/                    # Express backend (MVC)
│   ├── controllers/           # Request handlers
│   ├── routes/                # Express routers
│   ├── services/              # Business logic
│   ├── middleware/            # Auth, validation, error handler
│   ├── prisma/
│   │   ├── schema.prisma      # DB schema with enums & relations
│   │   └── seed.js            # Demo data seeder
│   ├── utils/                 # JWT helper, Prisma client, response utils
│   ├── validations/           # express-validator rules
│   └── server.js              # Entry point
│
├── package.json               # Monorepo root scripts
├── railway.toml               # Railway deployment config
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or a cloud DB URL)
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/your-username/projectflow.git
cd projectflow
```

### 2. Install all dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/projectflow"
JWT_SECRET="your-super-secret-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

### 4. Set up the database

```bash
# Create the database
createdb projectflow

# Push schema + generate Prisma client
npm run db:migrate    # or: cd server && npx prisma db push

# (Optional) Seed demo data
npm run db:seed
```

### 5. Start development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- API docs: http://localhost:5000/health

### Demo Accounts (after seeding)

| Role   | Email                       | Password    |
|--------|-----------------------------|-------------|
| Admin  | admin@projectflow.dev       | Admin@123   |
| Member | alice@projectflow.dev       | Member@123  |
| Member | bob@projectflow.dev         | Member@123  |

---

## 🌐 Railway Deployment

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/projectflow.git
git push -u origin main
```

### Step 2 — Create Railway project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo** → select your repo

### Step 3 — Add PostgreSQL

1. In Railway dashboard → **+ New** → **Database** → **PostgreSQL**
2. Railway auto-sets `DATABASE_URL` in your service's environment

### Step 4 — Set environment variables

In Railway → your service → **Variables**, add:

```
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-app.up.railway.app
```

> `DATABASE_URL` and `PORT` are injected automatically by Railway.

### Step 5 — Deploy

Railway triggers a build automatically on every push. It will:
1. Run `npm run install:all` — install all deps
2. Run `npm run build` — build the React app
3. Run `npm run db:generate` — generate Prisma client
4. On start: run `npm run db:migrate` then `npm start`

Your app will be live at the Railway-provided URL.

### Step 6 — Seed production data (optional)

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway run npm run db:seed
```

---

## 📡 REST API Reference

All API routes are prefixed with `/api`. Protected routes require:

```
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint           | Auth | Description          |
|--------|--------------------|------|----------------------|
| POST   | `/auth/signup`     | ✗    | Register new user    |
| POST   | `/auth/login`      | ✗    | Login, receive token |
| GET    | `/auth/me`         | ✓    | Get current user     |
| GET    | `/auth/users`      | ✓    | List all users       |

**POST /auth/signup**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Secret@123", "role": "MEMBER" }
```

**POST /auth/login**
```json
{ "email": "jane@example.com", "password": "Secret@123" }
```

---

### Projects

| Method | Endpoint                          | Role   | Description           |
|--------|-----------------------------------|--------|-----------------------|
| POST   | `/projects`                       | Admin  | Create project        |
| GET    | `/projects`                       | All    | List projects         |
| GET    | `/projects/:id`                   | All    | Get project details   |
| PUT    | `/projects/:id`                   | Admin  | Update project        |
| DELETE | `/projects/:id`                   | Admin  | Delete project        |
| POST   | `/projects/:id/members`           | Admin  | Add member            |
| DELETE | `/projects/:id/members/:memberId` | Admin  | Remove member         |
| GET    | `/projects/:id/members`           | All    | List members          |

---

### Tasks

| Method | Endpoint               | Role       | Description           |
|--------|------------------------|------------|-----------------------|
| POST   | `/tasks`               | Admin      | Create task           |
| GET    | `/tasks`               | All        | List/filter tasks     |
| GET    | `/tasks/:id`           | All        | Get task              |
| PUT    | `/tasks/:id`           | Admin/Self | Update task           |
| PATCH  | `/tasks/:id/status`    | All        | Update status only    |
| DELETE | `/tasks/:id`           | Admin      | Delete task           |

**GET /tasks** — query params: `status`, `priority`, `projectId`, `search`

---

### Dashboard

| Method | Endpoint      | Auth | Description           |
|--------|---------------|------|-----------------------|
| GET    | `/dashboard`  | ✓    | Role-aware analytics  |

---

## 🛡 Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT tokens expire after 7 days
- **Helmet** sets security headers
- **Rate limiting**: 100 requests / 15 min per IP
- CORS restricted to `CLIENT_URL`
- Input validation via **express-validator** on all write routes
- Role middleware guards every sensitive endpoint

---

## 🧪 Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one digit
- At least one special character (`@$!%*?&`)

---

## 🗄 Database Schema

```
User         ──┬── Project (createdBy)
               └── ProjectMember (many-to-many)
                         │
                      Project ──── Task (assignedTo → User)
```

**Enums:** `Role { ADMIN, MEMBER }` · `TaskStatus { TODO, IN_PROGRESS, DONE }` · `Priority { LOW, MEDIUM, HIGH }`

---

## 📜 License

MIT © 2024 ProjectFlow
