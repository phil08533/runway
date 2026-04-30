# Runway - Priority Issues & Fixes

## 🔴 CRITICAL (Must Fix Before Submission)

### 1. Hardcoded Database Credentials (db.php)
**Priority:** CRITICAL - SECURITY RISK
**Lines:** `db.php:5-8`
**Issue:** Database credentials hardcoded in version control
```php
const DB_HOST = '127.0.0.1';
const DB_USER = 'phil';
const DB_PASS = 'phil';
```
**Fix:** Use environment variables or update before committing
```php
const DB_HOST = getenv('DB_HOST') ?: 'localhost';
const DB_USER = getenv('DB_USER') ?: 'root';
const DB_PASS = getenv('DB_PASS') ?: '';
```

### 2. Missing .gitignore Entry
**Priority:** CRITICAL - SECURITY
**Issue:** `db.php` should be excluded from version control
**Fix:** Add to `.gitignore`:
```
db.php
.env
```

### 3. Main App Missing PWA Meta Tags
**Priority:** HIGH - FEATURE INCOMPLETE
**Location:** `/index.php` `<head>` section
**Issue:** Main app can't be installed as PWA, no metadata
**Fix:** Add from `/PWA/index.php` lines 13-19:
```html
<meta name="theme-color" content="#0a5fb5" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Runway" />
<meta name="description" content="A simple financial planning and budgeting app" />
<link rel="manifest" href="manifest.json" />
<link rel="apple-touch-icon" href="data:image/svg+xml,..." />
```

### 4. Main App Missing Service Worker Registration
**Priority:** HIGH - OFFLINE FUNCTIONALITY
**Location:** `/app.js` end of file (after line ~655)
**Issue:** Service worker won't load, offline mode won't work
**Fix:** Add from `/PWA/app.js`:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registered successfully'))
    .catch(err => console.log('Service Worker registration failed:', err));
}
```

---

## 🟡 MEDIUM (Should Fix - Documentation)

### 5. SETUP.md Has Incorrect File References
**Priority:** MEDIUM - CONFUSION RISK
**Issues:**
- References `config.php` (doesn't exist, should be `db.php`)
- References `database.sql` (actual: `schema.sql`)
- References `index.html` (should be `index.php`)
- Uses wrong database names (`future_worth` vs `futureworth`)

**Fix:** Update all references in SETUP.md:
- Line 20: `future_worth` → `futureworth`
- Line 23: `database.sql` → `schema.sql`
- Line 26-32: Update to reference `db.php` instead of `config.php`
- Line 48: `index.html` → `index.php`

---

## 🟠 LOW (Nice-to-Have - Not Blocking)

### 6. Savings Goals Only in localStorage
**Priority:** LOW - DATA PERSISTENCE
**Issue:** Savings goals not synced to database, lost if browser cache cleared
**Recommendation:** Create `savings_goals` table and database endpoints
**Current:** Works fine for assignment, can improve later

### 7. Hardcoded localhost in db.php
**Priority:** LOW - DEPLOYMENT ISSUE
**Issue:** `127.0.0.1` won't work on remote servers
**Current:** Works for local/assignment testing
**Fix:** Use environment variable:
```php
const DB_HOST = getenv('DB_HOST') ?: '127.0.0.1';
```

---

## 📋 Submission Checklist

Before submitting assignment, verify:
- [ ] Update db.php with correct credentials OR use env vars
- [ ] Add db.php to .gitignore
- [ ] Add PWA meta tags to /index.php
- [ ] Add service worker registration to /app.js
- [ ] Test with demo account
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Test all CRUD operations (add/edit/delete income, expenses)
- [ ] Test budget snapshots
- [ ] Test financial runway calculation
- [ ] Test theme switching
- [ ] Verify no hardcoded localhost in production version

---

## ✅ What's Already Good

- ✅ All core features implemented
- ✅ Authentication working properly
- ✅ Database schema correct
- ✅ API endpoints functional
- ✅ PWA folder properly set up
- ✅ docs/ folder for GitHub Pages ready
- ✅ Security practices (prepared statements, password hashing)
- ✅ Responsive UI
- ✅ Error handling

---

## 🎯 Time Estimates

| Issue | Complexity | Time |
|-------|-----------|------|
| Fix db.php credentials | Easy | 5 min |
| Update .gitignore | Easy | 2 min |
| Add PWA tags to main | Medium | 10 min |
| Add SW registration | Easy | 5 min |
| Update SETUP.md | Easy | 10 min |
| **TOTAL** | — | **32 min** |

Ready to submit after these fixes!
