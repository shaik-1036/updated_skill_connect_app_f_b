# PostgreSQL Migration - Quick Reference Card

## TL;DR Summary

You're migrating from **CockroachDB** (deleted) to **PostgreSQL**.
Your code needs **ZERO changes** - PostgreSQL is compatible.
You need **6 database tables** - schema provided in `postgres-migration.sql`.

---

## The 5-Minute Setup

```bash
# 1. Install PostgreSQL
brew install postgresql@15          # macOS

# 2. Start PostgreSQL
brew services start postgresql@15   # macOS

# 3. Create database
psql -U postgres -c "CREATE DATABASE app_db;"

# 4. Run migration
psql -U postgres -d app_db -f scripts/postgres-migration.sql

# 5. Update .env
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/app_db" >> .env

# 6. Start app
npm start

# 7. Verify
node scripts/validate-db.js
```

---

## Database Tables (6 Total)

| Table | Purpose | Rows |
|-------|---------|------|
| users | User accounts & profiles | 1000s |
| messages | System notifications | 100s |
| resumes | Resume uploads | 100s |
| old_age_homes | Donation recipients | 10s |
| orphans | Donation recipients | 10s |
| transactions | Donation records | 1000s |

---

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/app_db
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_UPLOAD_PRESET=xxx
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
```

See `ENV_SETUP_EXAMPLE.md` for full list.

---

## Connection Strings

```
Local:        postgresql://postgres:password@localhost:5432/app_db
Vercel:       postgresql://user:password@host.vercel.postgres.com/dbname
AWS RDS:      postgresql://admin:password@mydb.region.rds.amazonaws.com/dbname
Railway:      postgresql://user:password@host.railway.app:5432/dbname
```

---

## Commands Cheatsheet

```bash
# PostgreSQL service
brew services start postgresql@15     # Start (macOS)
brew services stop postgresql@15      # Stop (macOS)
sudo systemctl start postgresql       # Start (Linux)

# Database operations
psql -U postgres                      # Connect as postgres
CREATE DATABASE app_db;               # Create database
\c app_db                             # Switch database
\dt                                   # List tables
\d users                              # Show table structure
\q                                    # Exit

# Migration & validation
psql -U postgres -d app_db -f scripts/postgres-migration.sql  # Run migration
node scripts/validate-db.js           # Validate setup

# App testing
npm start                             # Start application
curl http://localhost:5000/health     # Test health endpoint
```

---

## Troubleshooting Flow

```
Problem: Connection refused
→ Solution: Start PostgreSQL service

Problem: Database doesn't exist
→ Solution: CREATE DATABASE app_db;

Problem: Tables not found
→ Solution: psql -U postgres -d app_db -f scripts/postgres-migration.sql

Problem: Wrong password
→ Solution: Check DATABASE_URL in .env

Problem: Application error
→ Solution: Run node scripts/validate-db.js
```

---

## Production Deployment (Vercel)

```
1. Go to Vercel Dashboard → Storage → Create Postgres
2. Copy POSTGRES_URL_NON_POOLING
3. Set as DATABASE_URL in Environment Variables
4. Run migration on production database
5. Deploy: git push (auto-deploys)
```

---

## API Endpoints (All Still Work)

```bash
# Auth
POST /api/signup          # Register user
POST /api/login           # User login
POST /api/forgot-password # Reset password

# Users
GET /api/users            # List all users
GET /api/user-stats       # User statistics
POST /api/upload-resume   # Upload resume
GET /api/user-resume      # Get resume
DELETE /api/delete-resume # Delete resume

# Messages
POST /api/send-message    # Send message
GET /api/messages         # Get messages
GET /api/message-stats    # Message stats

# Donations
POST /api/upload-qr       # Upload QR code
POST /api/upload-transaction  # Record donation
GET /api/old-age-homes    # Get homes
GET /api/orphans          # Get orphans
GET /api/transactions     # Get transactions
```

---

## Files You Received

| File | Read It For |
|------|------------|
| `postgres-migration.sql` | Database schema |
| `QUICK_MIGRATION_CHECKLIST.md` | Step-by-step setup |
| `POSTGRES_SETUP_GUIDE.md` | Detailed instructions |
| `ENV_SETUP_EXAMPLE.md` | Environment variables |
| `MIGRATION_SUMMARY.md` | Complete overview |
| `SETUP_VISUAL_GUIDE.md` | Diagrams & flows |
| `validate-db.js` | Validation tool |
| `QUICK_REFERENCE.md` | This card |

---

## Success Checklist

- [ ] PostgreSQL installed
- [ ] PostgreSQL running
- [ ] Database created
- [ ] Migration script executed
- [ ] .env updated with DATABASE_URL
- [ ] `npm start` works
- [ ] `/health` returns OK
- [ ] `validate-db.js` passes
- [ ] All API endpoints respond
- [ ] Deployed to Vercel

---

## Key Takeaways

✅ **No code changes** - Already PostgreSQL compatible
✅ **6 tables needed** - Schema provided
✅ **Multiple options** - Local or cloud PostgreSQL
✅ **Free alternatives** - Vercel, Railway, Render
✅ **Complete docs** - Everything you need
✅ **Validation tools** - Easy to verify setup

---

## Emergency Commands

```bash
# Backup your database
pg_dump -U postgres app_db > backup.sql

# Restore from backup
psql -U postgres app_db < backup.sql

# Check PostgreSQL version
psql --version

# Reset PostgreSQL password
psql -U postgres
ALTER USER postgres WITH PASSWORD 'newpass';

# Delete a database
psql -U postgres -c "DROP DATABASE app_db;"
```

---

## Pro Tips

💡 Test locally before deploying to production
💡 Keep .env in .gitignore (never commit secrets)
💡 Use validation script regularly
💡 Enable automatic backups in production
💡 Monitor database connection limits
💡 Archive old transaction data monthly

---

## Costs

| Option | Cost | Best For |
|--------|------|----------|
| Local PostgreSQL | Free | Development |
| Vercel PostgreSQL | $5-25/mo | Production |
| AWS RDS | $10-50/mo | Enterprise |
| Railway | $5-20/mo | Startups |
| Render | Free-$50/mo | Teams |

---

## Timeline

| Phase | Time |
|-------|------|
| Install & setup | 10 min |
| Create & migrate | 5 min |
| Local testing | 10 min |
| Production setup | 10 min |
| Deployment | 10 min |
| **Total** | **45 min** |

---

## Need Help?

1. Read `QUICK_MIGRATION_CHECKLIST.md` first
2. Run `node scripts/validate-db.js` for diagnostics
3. Check `POSTGRES_SETUP_GUIDE.md` troubleshooting section
4. Review `SETUP_VISUAL_GUIDE.md` for visual explanations

---

## Status: ✅ Ready to Migrate

All tools, scripts, and documentation provided.
Your code is ready.
Start with `QUICK_MIGRATION_CHECKLIST.md`

🚀 **Go!**
