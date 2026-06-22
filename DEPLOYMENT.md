# Deployment Guide

This project is a monorepo with two deployable apps:

- `client`: React/Vite frontend for Vercel
- `server`: Express/MySQL API for Render

## 1. Prepare The Database

The backend uses MySQL. Render does not provide managed MySQL, so use a MySQL host such as Railway, Aiven, PlanetScale, Clever Cloud, or your own VPS/database server.

Create the database and import your current local schema/data from XAMPP/phpMyAdmin.
This repo includes `ccn_db_dump.sql`, which can be imported into the hosted
database.

Required backend environment variables:

```env
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-mysql-database
JWT_SECRET=replace-with-a-long-random-secret
```

Recommended free MySQL-compatible database:

- TiDB Cloud Serverless

When creating the TiDB database, copy the host, port, username, password, and
database name into Render environment variables.

## 2. Push To GitHub

If the folder is not already a working Git repo:

```bash
git init
git add .
git commit -m "Prepare CCN system for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If the repo already exists locally, only run:

```bash
git add .
git commit -m "Prepare CCN system for deployment"
git push
```

## 3. Deploy Backend To Render

Create a new Render Web Service from the GitHub repo.

Settings:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Add the backend environment variables from step 1.

After deploy, Render will give an API URL like:

```text
https://ccn-api.onrender.com
```

## 4. Deploy Frontend To Vercel

Create a new Vercel project from the same GitHub repo.

Settings:

- Root Directory: `client`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Add this Vercel environment variable:

```env
VITE_API_URL=https://your-render-api-url.onrender.com
```

Redeploy the frontend after adding the variable.

## Important Upload Note

The current system stores uploaded images in `server/uploads`. On Render free hosting, local uploaded files may be lost when the service restarts or redeploys. For production, move image uploads to Cloudinary, S3, or another permanent file storage service.
