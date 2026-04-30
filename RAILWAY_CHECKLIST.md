# Railway Deployment - Quick Checklist

## ✅ Pre-Deployment (Do Once)

- [ ] Sign up at [railway.app](https://railway.app) with GitHub account
- [ ] Review RAILWAY_DEPLOYMENT.md for full details
- [ ] Ensure code is pushed to GitHub

---

## 🚀 Deployment Steps (15 minutes)

### 1. Create Project (2 min)
- [ ] Create new Railway project: `New Project` → `Empty Project`
- [ ] Name it: `Runway` or `FutureWorth`

### 2. Add MySQL Database (3 min)
- [ ] Click `+ Add Service` → `MySQL`
- [ ] Wait for MySQL to start (green indicator)
- [ ] Click MySQL service → `Connect` tab
- [ ] **Copy credentials:**
  - [ ] `DB_HOST` = `container.railway.internal`
  - [ ] `DB_USER` = `root`
  - [ ] `DB_PASS` = (save this!)

### 3. Create Database & Import Schema (5 min)

**Option A: phpMyAdmin (Recommended)**
- [ ] Click `+ Add Service` → `phpMyAdmin`
- [ ] Open phpMyAdmin link
- [ ] Login: username: `root`, password: (from MySQL)
- [ ] Create new database: `futureworth`
- [ ] Import file: `schema.sql`

**Option B: Terminal (Advanced)**
- [ ] Open MySQL service → Terminal
- [ ] Run: `mysql -u root -p -e "CREATE DATABASE futureworth;"`
- [ ] Run: `mysql -u root -p futureworth < schema.sql`

### 4. Connect GitHub Repository (2 min)
- [ ] Click `+ Add Service` → `GitHub Repo`
- [ ] Connect your GitHub account
- [ ] Select: `phil08533/runway`
- [ ] Select branch with your code
- [ ] Click deploy

Railway auto-detects PHP and deploys! ✅

### 5. Set Environment Variables (2 min)

Click PHP service → `Variables` tab → Add these:

```
DB_HOST = container.railway.internal
DB_NAME = futureworth
DB_USER = root
DB_PASS = (your MySQL password from step 2)
APP_ENV = production
```

**Railway will auto-redeploy after saving variables** ✅

---

## 🧪 Testing (2 min)

- [ ] Watch deployment in Railway dashboard (should show green ✅)
- [ ] Get your app URL from Railway dashboard
- [ ] Visit: `https://yourapp-production.railway.app/login.php`
- [ ] Click "Demo Login"
- [ ] Should see dashboard with financial overview

**If error:**
- [ ] Check MySQL service is running (green indicator)
- [ ] Check environment variables match
- [ ] Check build logs for PHP errors
- [ ] Verify schema.sql was imported

---

## 🎯 Your App URLs

Once deployed:

| URL | Purpose |
|-----|---------|
| `https://yourapp-production.railway.app/login.php` | Login page |
| `https://yourapp-production.railway.app/` | Main app (after login) |
| `https://yourapp-production.railway.app/api.php?action=dashboard` | API endpoint |

---

## 🔄 Auto-Deployment

After initial setup:

1. Push code to GitHub:
   ```bash
   git push origin your-branch
   ```

2. Railway automatically:
   - Detects changes
   - Rebuilds PHP app
   - Redeploys (30 seconds)

3. Your changes are live! ✅

---

## 📱 Connect GitHub Pages Frontend

To use GitHub Pages frontend with Railway backend:

In `/docs/app.js`, update the `api()` function:

```javascript
async function api(action, method = 'GET', body = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);
  
  // Use Railway backend URL
  const baseUrl = 'https://yourapp-production.railway.app';
  const res = await fetch(`${baseUrl}/api.php?action=${encodeURIComponent(action)}`, options);
  
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
```

Then:
1. Deploy to GitHub Pages from `/docs` folder
2. It will use the Railway backend for all API calls

---

## 💾 Common Database Operations

### Backup Your Database
```bash
mysqldump -h your-railway-host -u root -p futureworth > backup.sql
```

### Restore from Backup
```bash
mysql -h your-railway-host -u root -p futureworth < backup.sql
```

### Access Database via Terminal
```
Click: MySQL service → Terminal
Type: mysql -u root -p futureworth
Enter password when prompted
```

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| "Connection refused" | Check MySQL running, `DB_HOST=container.railway.internal` |
| "Database not found" | Import schema.sql via phpMyAdmin |
| "Blank page" | Check browser console (F12), check build logs |
| "API 404 error" | Check Railway PHP service is running, URL is correct |
| "Auth failed" | Ensure MySQL database and schema imported |

**Build Logs Location:** Click PHP service → Deployments tab

---

## 🎉 You're Done!

Your Runway app is now:
- ✅ Running on Railway.app (with $5 free credits/month)
- ✅ Connected to MySQL database
- ✅ Auto-deploying from GitHub
- ✅ Using environment variables for security
- ✅ Ready for users to register and use

**Next Steps:**
1. Invite others to test
2. Monitor usage in Railway dashboard
3. Keep code updated on GitHub
4. Railway auto-deploys each push

---

## 📞 Need Help?

- Railway docs: https://docs.railway.app
- PHP guide: https://docs.railway.app/databases/mysql
- GitHub integration: https://docs.railway.app/develop/github

Good luck! 🚀
