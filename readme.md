```md
# 🚀 Full-Stack Application Deployment (React + Node + PostgreSQL with Docker)

This repository contains a full-stack application consisting of:

- **Frontend**: React  
- **Backend**: Node.js (Express)  
- **Database**: PostgreSQL (Dockerized)  
- **Containerization**: Docker & Docker Compose (no Nginx)  

All three services run in Docker and communicate with each other using a shared Docker network.

---

## 🏗️ Architecture

```

React (3000)  --->  Node.js (5000)  --->  PostgreSQL (5432)

```

- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:5000`
- PostgreSQL is available on: `localhost:5432`

Inside Docker, the backend connects to Postgres using:

```

postgresql://admin:admin123@postgres:5432/mydb

```

---

## 📁 Project Structure

```

my-app/
│
├── frontend/
│   ├── Dockerfile
│   └── (React app files)
│
├── backend/
│   ├── Dockerfile
│   ├── .env
│   ├── init.sql
│   └── server.js
│
└── docker-compose.yml

```

---

## 🐳 Docker Setup

-- install docker on your pc or server first. refer the backend folder for all installtion setup. 

### Backend `.env`

Inside `backend/.env`:

```

DATABASE_URL=postgresql://admin:admin123@postgres:5432/mydb

````

> **Important:** Use `postgres` as host (Docker service name), NOT `localhost`.

---

## PostgreSQL Table Initialization (`backend/init.sql`)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  fullname TEXT NOT NULL,
  password TEXT NOT NULL,
  dob TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  phone TEXT,
  status TEXT,
  qualification TEXT,
  branch TEXT,
  passoutyear TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  resume_data TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS old_age_homes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  qr_url TEXT,
  home_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orphans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  qr_url TEXT,
  home_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  amount DECIMAL(10, 2),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  screenshot_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
````

---


## ▶️ How to Run the Application

From the project root, run:

```
docker-compose up --build
```

Wait until all containers are healthy.

---

## 🌐 Access the Application

| Service      | URL                                                          |
| ------------ | ------------------------------------------------------------ |
| Frontend     | [http://localhost:3000](http://localhost:3000)               |
| Backend      | [http://localhost:5000](http://localhost:5000)               |
| Health Check | [http://localhost:5000/health](http://localhost:5000/health) |
| Postgres     | localhost:5432                                               |

---

## 🗄️ Verify PostgreSQL Tables

Login to the database container:

```
docker exec -it my-postgres psql -U admin -d mydb
```

Then run:

```
\dt;
```

---

## 🧪 Sample API Test (Postman)

### Create User (POST)

```
POST http://localhost:5000/users
```

Body:

```json
{
  "email": "shaik@example.com",
  "fullname": "Shaik Allabakash",
  "password": "test123"
}
```

### Get All Users (GET)

```
GET http://localhost:5000/users
```

---

## 🛠️ Tech Stack

* React
* Node.js (Express)
* PostgreSQL
* Docker & Docker Compose

---

## 📌 Notes


* Tables are created automatically when PostgreSQL starts.
* Backend and database communicate via Docker internal network.

---

Happy Coding! 🚀

```
```
