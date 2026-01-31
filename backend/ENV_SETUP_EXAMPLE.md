# Environment Variables Setup

## For Local Testing

Create a `.env` or `.env.local` file in your project root:

```env
# PostgreSQL Local Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/your_app_db

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Email Configuration (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapp.com

# Server Port
PORT=5000
TEMP_DIR=/tmp/uploads
```

## For Production (Vercel Deployment)

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:

```env
DATABASE_URL=postgresql://username:password@host.vercel.postgres.com/dbname
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapp.com
```

## Getting Your Variables

### Vercel PostgreSQL
1. Connect PostgreSQL from Storage
2. Copy the `POSTGRES_URL_NON_POOLING` as `DATABASE_URL`

### Cloudinary
1. Sign up at cloudinary.com
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret
4. Create upload preset: Settings → Upload

### Gmail/Email
1. Enable 2FA on Google Account
2. Generate App Password
3. Use that as EMAIL_PASSWORD

## Quick Start Command

After setting up .env:
```bash
npm start
# Server should run on http://localhost:5000
```
