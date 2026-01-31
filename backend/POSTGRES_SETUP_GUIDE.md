# PostgreSQL Migration Guide

## Overview
You need to migrate from CockroachDB to PostgreSQL. Your application uses **6 database tables**.

## Tables Required

1. **users** - User registration and profile data
2. **messages** - System messages by category
3. **resumes** - Resume uploads and extracted text
4. **old_age_homes** - Donation recipients (homes)
5. **orphans** - Donation recipients (orphans)
6. **transactions** - Donation transaction records

---

## Setup Instructions

### Option 1: Local PostgreSQL Testing

#### Step 1: Install PostgreSQL
- **macOS**: `brew install postgresql@15`
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

#### Step 2: Start PostgreSQL
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows (PowerShell as Admin)
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
```

#### Step 3: Create a Database
```bash
# Access PostgreSQL CLI
psql postgres

# Inside psql, run:
CREATE DATABASE your_app_db;
\c your_app_db

# Exit psql
\q
```

#### Step 4: Run Migration Script
```bash
psql -U postgres -d your_app_db -f scripts/postgres-migration.sql
```

#### Step 5: Verify Tables
```bash
psql -U postgres -d your_app_db
\dt  # Lists all tables
\d users  # Shows table structure
```

#### Step 6: Update .env File
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/your_app_db
```

---

### Option 2: Production PostgreSQL Setup

#### A. Using Vercel PostgreSQL (Recommended for Easy Deployment)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Storage** tab
4. Click **Create** → **Postgres**
5. Follow Vercel's setup wizard
6. Copy the `DATABASE_URL` from the credentials
7. Add to your `.env.local` and environment variables

#### B. Using AWS RDS PostgreSQL
1. Go to AWS Console → RDS
2. Create new DB instance → PostgreSQL
3. Configure: Multi-AZ, Backup retention
4. Get connection string: `postgresql://username:password@hostname:5432/dbname`
5. Run migration script against the RDS endpoint

#### C. Using Railway.app (Simple Alternative)
1. Create account at railway.app
2. New Project → PostgreSQL
3. Railway provides `DATABASE_URL`
4. Run migration script

#### D. Using Render (Another Option)
1. Create account at render.com
2. New PostgreSQL Database
3. Copy connection string to `.env`

---

## Running the Migration Script

### Via psql CLI
```bash
psql -U postgres -d your_app_db -f scripts/postgres-migration.sql
```

### Via Node.js (in your project)
```bash
node -e "
  const pool = require('./config/db');
  const fs = require('fs');
  const sql = fs.readFileSync('./scripts/postgres-migration.sql', 'utf8');
  pool.query(sql, (err) => {
    if (err) console.error(err);
    else console.log('Tables created successfully');
    process.exit();
  });
"
```

---

## Configuration Update

### Update config/db.js (Already Done ✓)
Your current config is already PostgreSQL-compatible:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### Environment Variables Needed
```env
# Local Testing
DATABASE_URL=postgresql://postgres:password@localhost:5432/your_app_db

# Production (Vercel PostgreSQL)
DATABASE_URL=postgresql://user:password@host.vercel.postgres.com/dbname

# Production (AWS RDS)
DATABASE_URL=postgresql://admin:password@mydb.region.rds.amazonaws.com:5432/dbname
```

---

## Verification Checklist

After setup, verify everything works:

```bash
# 1. Test database connection
node -e "
  const pool = require('./config/db');
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err ? 'Connection failed' : 'Connected:', res.rows[0]);
  });
"

# 2. Check all tables exist
psql -U postgres -d your_app_db -c "\dt"

# 3. Check table structures
psql -U postgres -d your_app_db -c "\d users"

# 4. Test the app
npm start
# Visit: http://localhost:5000/health
```

---

## Common Issues & Solutions

### Issue: "uuid-ossp" extension not found
**Solution**: Run in psql first:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Issue: Connection refused on localhost:5432
**Solution**: PostgreSQL not running. Start it:
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Issue: Password authentication failed
**Solution**: Reset PostgreSQL password:
```bash
# macOS/Linux
psql -U postgres
ALTER USER postgres WITH PASSWORD 'newpassword';
```

### Issue: Application still looking for CockroachDB
**Solution**: 
1. Check `.env` file has correct `DATABASE_URL`
2. Restart your application
3. Clear any cached connections in your app

---

## Summary: Steps to Get Running

1. ✅ **Local**: Install PostgreSQL → Create database → Run migration → Update .env
2. ✅ **Production**: Choose provider (Vercel/AWS/Railway) → Get DATABASE_URL → Run migration → Deploy

Your application code **does NOT need changes** - it's already PostgreSQL compatible!

---

## Notes for Your Specific App

- **No code changes needed** in routes or config
- **All queries are already PostgreSQL compatible**
- **UUID generation works the same way** with `uuid_generate_v4()`
- **All your routes (auth, users, messages, uploads) will work unchanged**
