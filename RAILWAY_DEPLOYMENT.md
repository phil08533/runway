# Deploying Runway to Railway

Railway is a modern hosting platform perfect for full-stack apps. This guide walks through deploying Runway's PHP backend + MySQL database.

## 🚀 Quick Start (15 minutes)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Start Free" or sign in with GitHub
3. Create a free account (includes $5 free credits)

### Step 2: Create New Project
1. Click "New Project"
2. Select "Empty Project"
3. Name it "Runway" or "FutureWorth"

### Step 3: Add MySQL Database
1. In your new project, click "+ Add Service"
2. Search for and select "MySQL"
3. Railway auto-generates credentials - save them temporarily
4. Wait 2-3 minutes for MySQL to start

### Step 4: Add PHP Service (from GitHub)
1. Click "+ Add Service"
2. Select "GitHub Repo"
3. Connect your GitHub account
4. Select your `phil08533/runway` repository
5. Select the branch with your code

### Step 5: Configure Environment Variables
In Railway dashboard, go to your PHP service:

**Settings → Variables** - Add these:
```
DB_HOST: (copy from MySQL service → Connect)
DB_NAME: futureworth
DB_USER: root
DB_PASS: (copy from MySQL service)
DOMAIN: (your-railway-app.railway.app - will be assigned)
```

**Where to find MySQL credentials:**
1. Click on MySQL service in dashboard
2. Click "Connect"
3. Scroll to "MySQLi Connection String" or find individual values:
   - Host: `container.railway.internal`
   - Port: `3306`
   - Username: `root`
   - Password: (shown in the Connect tab)

### Step 6: Import Database Schema
Option A - Using phpMyAdmin (via Railway):
1. Add phpMyAdmin service to your project
2. Connect with MySQL credentials
3. Create new database `futureworth`
4. Import `schema.sql` via phpMyAdmin UI

Option B - Using Railway Terminal:
1. Connect to your Railway MySQL service
2. Run: `mysql -u root -p < schema.sql`

### Step 7: Configure PHP Service
In the PHP service settings:

**Build Configuration:**
- Framework: PHP
- Start Command: `php -S 0.0.0.0:8080`

**Railway should auto-detect `index.php` as entry point**

---

## 🔧 Detailed Setup Instructions

### Phase 1: Account Setup (2 minutes)

```bash
# Step 1: Visit railway.app and sign up
# Use GitHub login for faster setup
```

**What you'll get:**
- Free tier: $5/month credit (plenty for testing)
- Custom domain: `yourapp.railway.app`
- Auto HTTPS/SSL certificate

---

### Phase 2: Project Creation (3 minutes)

**In Railway Dashboard:**

1. **Create Project**
   ```
   Click: New Project → Empty Project
   Name: Runway (or FutureWorth)
   ```

2. **Add MySQL**
   ```
   Click: + Add Service
   Search: MySQL
   Select: MySQL
   Wait: 2-3 minutes to start
   ```

3. **Get MySQL Credentials**
   ```
   Click: MySQL service
   Click: Connect tab
   Copy: Host, Username, Password
   
   Fields you need:
   - DB_HOST: container.railway.internal
   - DB_USER: root
   - DB_PASS: (generated randomly)
   ```

---

### Phase 3: Connect GitHub Repository (2 minutes)

1. **Add Git Service**
   ```
   Click: + Add Service
   Select: GitHub Repo
   Click: Connect GitHub Account
   Authorize Railway to access GitHub
   ```

2. **Select Repository**
   ```
   Choose: phil08533/runway
   Select Branch: (choose your branch)
   Click: Deploy
   ```

Railway will auto-detect `index.php` and use PHP runtime.

---

### Phase 4: Set Environment Variables (5 minutes)

**In PHP Service Settings:**

Click: Variables → Add Variable

```env
DB_HOST=container.railway.internal
DB_NAME=futureworth
DB_USER=root
DB_PASS=<your-generated-password>
APP_ENV=production
```

**Why these matter:**
- `DB_HOST`: Railway internal networking (not localhost)
- `DB_NAME`: Your database name
- `DB_USER`, `DB_PASS`: MySQL credentials from Step 2
- `APP_ENV`: Tells app it's in production

---

### Phase 5: Create Database & Import Schema (5 minutes)

**Option A: Using phpMyAdmin (Recommended)**

1. **Add phpMyAdmin Service**
   ```
   Click: + Add Service
   Search: phpMyAdmin
   Select: phpMyAdmin
   Wait: 1 minute to start
   ```

2. **Connect to phpMyAdmin**
   ```
   Click: phpMyAdmin service
   Click: Connect/View
   Opens: phpMyAdmin web interface
   
   Login:
   Username: root
   Password: (from MySQL credentials)
   ```

3. **Create Database**
   ```
   Click: "New" in left sidebar
   Database name: futureworth
   Collation: utf8mb4_unicode_ci
   Click: Create
   ```

4. **Import Schema**
   ```
   Select: futureworth database
   Click: Import tab
   Choose File: schema.sql (from your repo)
   Click: Import
   
   Should show: "Import has been successful"
   ```

**Option B: Using Railway Terminal (Advanced)**

1. **Open Terminal in Railway**
   ```
   Click: MySQL service
   Click: Terminal tab
   ```

2. **Create Database & Import**
   ```bash
   mysql -u root -p -e "CREATE DATABASE futureworth;"
   mysql -u root -p futureworth < schema.sql
   ```

---

### Phase 6: Configure Your App (2 minutes)

**Update db.php to use environment variables:**

```php
<?php
// db.php
const DB_HOST = $_ENV['DB_HOST'] ?? '127.0.0.1';
const DB_NAME = $_ENV['DB_NAME'] ?? 'futureworth';
const DB_USER = $_ENV['DB_USER'] ?? 'root';
const DB_PASS = $_ENV['DB_PASS'] ?? '';

// Rest of file stays the same...
?>
```

**Commit and push this change:**
```bash
git add db.php
git commit -m "Use environment variables for database config"
git push origin your-branch
```

Railway will auto-redeploy when you push changes.

---

### Phase 7: First Deployment (Automatic)

When you push to GitHub, Railway **automatically**:
1. Detects PHP app
2. Installs PHP dependencies
3. Deploys to production
4. Assigns URL: `yourapp-production.railway.app`

**Watch deployment:**
1. Click: PHP service
2. Click: "Deployments" tab
3. See real-time build logs
4. Green checkmark = success ✅

---

## ✅ Testing Your Deployment

### Step 1: Check Application URL
```
Your app will be at:
https://yourapp-production.railway.app

Or custom domain if you set one up
```

### Step 2: Test Login Page
```
Visit: https://yourapp-production.railway.app/login.php

Should see:
- Login form
- Registration form
- Demo login button
```

### Step 3: Test Demo Account
```
Click: "Demo Login" button
Should redirect to: /index.php (dashboard)

If error:
- Check MySQL is running
- Check environment variables
- Check database was created
```

### Step 4: Test Features
```
✅ Add income (Test → Test Job → $5000 → Monthly)
✅ Add expense (Test → Rent → $1000 → Monthly)
✅ Check dashboard updates
✅ Create budget snapshot
✅ Edit items
✅ Delete items
✅ Change theme
```

---

## 🔗 Configure GitHub Pages Frontend

Now that backend is deployed on Railway, update your frontend API calls:

### Option 1: Use Relative URLs (Simple)
If GitHub Pages is on same domain, no change needed.

### Option 2: Use Absolute URLs (Better)
In `/docs/app.js`, modify the `api()` function:

```javascript
async function api(action, method = 'GET', body = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);
  
  // Use absolute URL to Railway backend
  const apiUrl = `https://yourapp-production.railway.app/api.php?action=${encodeURIComponent(action)}`;
  
  const res = await fetch(apiUrl, options);
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
```

Or use environment variable:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || 'https://yourapp-production.railway.app';

async function api(action, method = 'GET', body = null) {
  // ... rest of code uses API_BASE + endpoint
}
```

---

## 🐛 Troubleshooting

### Error: "Connection refused" when testing
**Problem:** Can't connect to MySQL
**Fix:** 
1. Check MySQL service is running (green in dashboard)
2. Verify `DB_HOST=container.railway.internal` (not localhost)
3. Check environment variables match MySQL credentials

### Error: "Database doesn't exist"
**Problem:** schema.sql not imported
**Fix:**
1. Use phpMyAdmin to import schema.sql
2. Or use Terminal to run: `mysql -u root -p futureworth < schema.sql`

### Deployment failed
**Problem:** PHP syntax error or missing dependencies
**Fix:**
1. Check build logs in Railway dashboard
2. Test locally first: `php -S localhost:8000`
3. Push fix to GitHub, Railway auto-redeploys

### 404 on login.php
**Problem:** File not found
**Fix:**
1. Check files are in repository root
2. Check `.gitignore` doesn't exclude them
3. Verify branch is correct in Railway settings

### Blank page on dashboard
**Problem:** JavaScript error or API call failing
**Fix:**
1. Check browser console (F12 → Console tab)
2. Check Network tab for failed API calls
3. Verify API endpoints are configured correctly

---

## 📊 Environment Variables Reference

| Variable | Value | Where From |
|----------|-------|-----------|
| `DB_HOST` | `container.railway.internal` | Railway MySQL service |
| `DB_NAME` | `futureworth` | You created this |
| `DB_USER` | `root` | Railway MySQL default |
| `DB_PASS` | (generated) | Railway MySQL credentials |
| `APP_ENV` | `production` | You set this |

---

## 💾 Backup & Maintenance

### Regular Backups
```bash
# Download MySQL backup locally
mysqldump -h your-host -u root -p futureworth > backup.sql

# Restore from backup
mysql -u root -p futureworth < backup.sql
```

### View Logs
In Railway dashboard:
- Click service → Logs tab
- See real-time error messages
- Helpful for debugging

### Monitor Usage
Railway free tier includes $5 credit:
- MySQL: ~$10/month (but $5 free)
- PHP app: ~$5/month (often free)
- Free tier usually covers hobby projects

---

## 🎯 Next Steps

After deployment:

1. **Test all features** on Railway URL
2. **Connect GitHub Pages** to your Railway backend
3. **Set custom domain** (optional, in Railway settings)
4. **Configure auto-deploys** (already done, auto on git push)
5. **Set up monitoring** (Railway dashboard shows all metrics)
6. **Enable auto-scaling** (optional, in settings)

---

## 📚 Useful Links

- Railway Docs: https://docs.railway.app
- PHP Support: https://docs.railway.app/databases/mysql
- Troubleshooting: https://docs.railway.app/troubleshooting

---

## ✨ You're Done!

Your Runway app is now:
- ✅ Running on Railway with PHP backend
- ✅ Connected to MySQL database
- ✅ Auto-deploying from GitHub
- ✅ Protected with environment variables
- ✅ Ready for GitHub Pages frontend

**Next: Point GitHub Pages to your Railway backend URL**

Questions? Check Railway docs or test locally first with `php -S localhost:8000`
