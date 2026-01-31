# Quick PostgreSQL Migration Checklist

## Database Tables to Create: 6 Tables

- [ ] **users** - User accounts and profiles
- [ ] **messages** - System messages
- [ ] **resumes** - Resume uploads
- [ ] **old_age_homes** - Donation recipients
- [ ] **orphans** - Orphan recipients
- [ ] **transactions** - Donation records

---

## Step-by-Step Setup

### Local Testing Setup (Windows/Mac/Linux)

- [ ] Step 1: Install PostgreSQL 15+
  - Windows: https://www.postgresql.org/download/windows/
  - macOS: `brew install postgresql@15`
  - Linux: `sudo apt-get install postgresql`

- [ ] Step 2: Start PostgreSQL service
  - macOS: `brew services start postgresql@15`
  - Linux: `sudo systemctl start postgresql`
  - Windows: Check Services panel

- [ ] Step 3: Create new database
  ```bash
  psql -U postgres
  CREATE DATABASE your_app_db;
  \c your_app_db
  \q
  ```

- [ ] Step 4: Run the migration script
  ```bash
  psql -U postgres -d your_app_db -f scripts/postgres-migration.sql
  ```

- [ ] Step 5: Verify tables created
  ```bash
  psql -U postgres -d your_app_db -c "\dt"
  ```
  You should see all 6 tables listed

- [ ] Step 6: Update .env file
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/your_app_db
  ```

- [ ] Step 7: Test the app
  ```bash
  npm start
  # Visit: http://localhost:5000/health
  ```

---

### Production Deployment (Choose One)

#### Option A: Vercel PostgreSQL (Recommended)
- [ ] Go to Vercel Dashboard
- [ ] Select your project
- [ ] Go to **Storage** → **Create** → **Postgres**
- [ ] Follow setup wizard
- [ ] Copy `POSTGRES_URL_NON_POOLING` → Use as `DATABASE_URL`
- [ ] Add to Environment Variables
- [ ] Run migration on production database
- [ ] Deploy to Vercel

#### Option B: AWS RDS
- [ ] Create RDS PostgreSQL instance
- [ ] Configure security groups (port 5432)
- [ ] Get connection string
- [ ] Add to Vercel Environment Variables
- [ ] Run migration script

#### Option C: Railway.app
- [ ] Create account and project
- [ ] Add PostgreSQL database
- [ ] Get connection URL
- [ ] Add to Environment Variables
- [ ] Deploy

---

## Code Changes Required: NONE! ✓

Your application is **already compatible** with PostgreSQL:
- ✅ config/db.js uses `pg` library (PostgreSQL client)
- ✅ All SQL queries are standard PostgreSQL
- ✅ UUID generation uses `uuid_generate_v4()`
- ✅ No breaking changes needed

---

## Files Created for You

1. **scripts/postgres-migration.sql** - Database schema
2. **POSTGRES_SETUP_GUIDE.md** - Detailed setup instructions
3. **ENV_SETUP_EXAMPLE.md** - Environment variables template
4. **QUICK_MIGRATION_CHECKLIST.md** - This checklist

---

## Key Points to Remember

- Your code is **already PostgreSQL compatible** - no changes needed!
- You need to create **6 database tables**
- The migration script handles all table creation
- Environment variable `DATABASE_URL` is critical
- Test locally first, then deploy to production

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | PostgreSQL not running - start the service |
| "uuid-ossp" error | Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` |
| Tables not found | Re-run migration script with correct database |
| Application error | Check DATABASE_URL in .env matches your database |
| Password rejected | Verify PostgreSQL credentials in DATABASE_URL |

---

## Next Steps

1. Follow "Local Testing Setup" section
2. Verify all tables are created
3. Test the application locally
4. Choose production provider (Vercel recommended)
5. Run migration on production database
6. Deploy your application

---

Good luck! Your app will be running on PostgreSQL shortly! 🚀
