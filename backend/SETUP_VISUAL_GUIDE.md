# PostgreSQL Setup - Visual Guide

## Your Application Architecture

```
┌─────────────────────────────────────────────┐
│         Your Express.js Application         │
│                                             │
│  Routes:                                    │
│  • /api/signup, /api/login                 │
│  • /api/users, /api/user-stats             │
│  • /api/messages, /api/message-stats       │
│  • /api/upload-resume                      │
│  • /api/upload-qr, /api/upload-transaction │
└─────────────────┬───────────────────────────┘
                  │ (uses pg client)
                  │ DATABASE_URL
                  ▼
┌─────────────────────────────────────────────┐
│         PostgreSQL Database                 │
│                                             │
│  Tables:                                    │
│  ✓ users                                   │
│  ✓ messages                                │
│  ✓ resumes                                 │
│  ✓ old_age_homes                           │
│  ✓ orphans                                 │
│  ✓ transactions                            │
└─────────────────────────────────────────────┘
```

---

## Local Development Setup

```
Step 1: Install PostgreSQL
   ↓
Step 2: Start PostgreSQL Service
   ↓
Step 3: Create Database
   ↓
Step 4: Run Migration Script
   ↓
Step 5: Update .env File
   ↓
Step 6: Test Application
```

### Step-by-Step Details

```
┌─────────────────────────────────────────────────┐
│ STEP 1: Install PostgreSQL                     │
├─────────────────────────────────────────────────┤
│                                                 │
│ Windows:                                        │
│ 1. Download: postgresql.org/download/windows   │
│ 2. Run installer                               │
│ 3. Remember postgres password                  │
│                                                 │
│ macOS:                                          │
│ 1. brew install postgresql@15                  │
│                                                 │
│ Linux (Ubuntu):                                │
│ 1. sudo apt-get update                         │
│ 2. sudo apt-get install postgresql             │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 2: Start PostgreSQL                       │
├─────────────────────────────────────────────────┤
│                                                 │
│ Windows: Check Services app (PostgreSQL)       │
│ macOS:   brew services start postgresql@15     │
│ Linux:   sudo systemctl start postgresql       │
│                                                 │
│ Verify: psql --version                         │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 3: Create Database                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ $ psql -U postgres                             │
│ password: (enter postgres password)            │
│                                                 │
│ postgres=# CREATE DATABASE app_db;             │
│ postgres=# \c app_db                           │
│ app_db=# \q                                    │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 4: Run Migration                          │
├─────────────────────────────────────────────────┤
│                                                 │
│ $ psql -U postgres -d app_db \                 │
│   -f scripts/postgres-migration.sql            │
│                                                 │
│ Output: CREATE EXTENSION...                    │
│         CREATE TABLE users...                  │
│         CREATE TABLE messages...               │
│         ... (and more)                         │
│                                                 │
│ Verify: psql -U postgres -d app_db -c "\dt"   │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 5: Update .env File                       │
├─────────────────────────────────────────────────┤
│                                                 │
│ Create/Edit: .env (in project root)            │
│                                                 │
│ DATABASE_URL=postgresql://postgres:password\   │
│   @localhost:5432/app_db                       │
│                                                 │
│ (Replace "password" with your postgres pwd)    │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ STEP 6: Test Application                       │
├─────────────────────────────────────────────────┤
│                                                 │
│ $ npm start                                    │
│                                                 │
│ Output: Server running on port 5000            │
│                                                 │
│ Browser: http://localhost:5000/health          │
│ Response: {"status": "OK"}                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Production Deployment (Vercel + PostgreSQL)

```
┌──────────────────────────────────────────────────────────┐
│ VERCEL DEPLOYMENT FLOW                                   │
└──────────────────────────────────────────────────────────┘

Your Local Development
    ↓ (git push)
GitHub Repository
    ↓ (automatic deployment)
Vercel Project
    ├─ Connected to PostgreSQL (Vercel Storage)
    ├─ Environment Variables Set
    └─ Application Running
        └─ http://your-app.vercel.app
```

### Vercel PostgreSQL Setup

```
1. Vercel Dashboard
   ├─ Select Your Project
   ├─ Go to "Storage"
   ├─ Click "Create"
   └─ Select "Postgres"
                ↓
2. Configure Database
   ├─ Choose Region
   ├─ Confirm PostgreSQL
   └─ Create
                ↓
3. Get Connection String
   ├─ Copy: POSTGRES_URL_NON_POOLING
   ├─ Rename to: DATABASE_URL
   └─ Note: Save this!
                ↓
4. Add to Environment Variables
   ├─ Go to "Settings"
   ├─ "Environment Variables"
   ├─ Paste DATABASE_URL
   └─ Save
                ↓
5. Run Migration on Production
   ├─ Connect to Vercel PostgreSQL
   ├─ Run: postgres-migration.sql
   └─ Verify tables created
                ↓
6. Deploy Application
   ├─ Push code to GitHub
   ├─ Vercel auto-deploys
   └─ Application live!
```

---

## Database Connection Strings

### Local Development
```
postgresql://postgres:mypassword@localhost:5432/app_db
                  │          │           │            │
                  │          │           │            └─ Database name
                  │          │           └────────────── Port (5432)
                  │          └──────────────────────── Host (localhost)
                  └─────────────────────────────────── Password
```

### Production - Vercel PostgreSQL
```
postgresql://user:password@host.vercel.postgres.com:5432/dbname
                           │                        │      │
                           │                        │      └─ DB name
                           │                        └──────── Port (5432)
                           └───────────────────────────────── Vercel host
```

### Production - AWS RDS
```
postgresql://admin:password@mydb.region.rds.amazonaws.com:5432/dbname
                            │                                  │
                            │                                  └─ DB name
                            └──────────────────────────────────── AWS host
```

---

## File Structure

```
your-project/
├── server.js                    ← Main application
├── .env                         ← Environment variables (local)
├── .gitignore                   ← Make sure .env is ignored
│
├── config/
│   └── db.js                    ← PostgreSQL connection
│
├── routes/
│   ├── auth.js                  ← User signup/login
│   ├── users.js                 ← User data & resumes
│   ├── messages.js              ← System messages
│   └── admin.js                 ← File uploads & donations
│
├── scripts/
│   ├── postgres-migration.sql   ← ⭐ Database schema
│   └── validate-db.js           ← Validation tool
│
└── Documentation/
    ├── QUICK_MIGRATION_CHECKLIST.md   ← Start here!
    ├── POSTGRES_SETUP_GUIDE.md        ← Detailed guide
    ├── ENV_SETUP_EXAMPLE.md           ← Env variables
    ├── MIGRATION_SUMMARY.md           ← Overview
    └── SETUP_VISUAL_GUIDE.md          ← This file
```

---

## Validation Checklist

```
✓ PostgreSQL Installed
  $ psql --version

✓ PostgreSQL Running
  $ psql -U postgres -c "SELECT 1"

✓ Database Created
  $ psql -U postgres -l | grep app_db

✓ Tables Created
  $ psql -U postgres -d app_db -c "\dt"
  Expected: users, messages, resumes, old_age_homes, orphans, transactions

✓ .env File Set
  $ cat .env | grep DATABASE_URL

✓ Application Starts
  $ npm start
  Expected: "Server running on port 5000"

✓ API Works
  $ curl http://localhost:5000/health
  Expected: {"status":"OK"}

✓ Validation Script Passes
  $ node scripts/validate-db.js
  Expected: "All required tables are present!"
```

---

## Troubleshooting Decision Tree

```
Is PostgreSQL installed?
├─ No  → Install PostgreSQL (postgresql.org)
└─ Yes → Is PostgreSQL running?
          ├─ No  → Start service (brew services start postgresql@15)
          └─ Yes → Is database created?
                   ├─ No  → Run: CREATE DATABASE app_db;
                   └─ Yes → Is migration run?
                            ├─ No  → Run: psql -U postgres -d app_db -f scripts/postgres-migration.sql
                            └─ Yes → Are tables created?
                                     ├─ No  → Re-run migration
                                     └─ Yes → Is .env updated?
                                              ├─ No  → Add DATABASE_URL to .env
                                              └─ Yes → Run: npm start
                                                       └─ Application Ready! ✓
```

---

## Quick Command Reference

```bash
# Installation
brew install postgresql@15                    # macOS
sudo apt-get install postgresql               # Linux

# Starting/Stopping
brew services start postgresql@15             # Start macOS
sudo systemctl start postgresql               # Start Linux
brew services stop postgresql@15              # Stop macOS

# Database Operations
psql -U postgres                              # Connect to PostgreSQL
CREATE DATABASE app_db;                       # Create database
\c app_db                                     # Switch to database
\dt                                           # List tables
\d users                                      # Describe table structure

# Migration
psql -U postgres -d app_db -f scripts/postgres-migration.sql

# Validation
node scripts/validate-db.js                   # Run validation

# Testing
npm start                                     # Start app
curl http://localhost:5000/health             # Test health
```

---

## That's it! 🎉

You now have all the tools and documentation to:
1. ✅ Set up PostgreSQL locally
2. ✅ Create all required tables
3. ✅ Test your application
4. ✅ Deploy to production

Start with **QUICK_MIGRATION_CHECKLIST.md** and follow step-by-step!
