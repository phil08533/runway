# Converting Runway to Static JSON-Based App

## 🎯 What Changes

### Remove (No Longer Needed)
- ❌ PHP files (api.php, auth.php, db.php)
- ❌ login.php
- ❌ MySQL/database
- ❌ Session management
- ❌ User authentication

### Keep & Modify
- ✅ index.php → index.html (convert to pure HTML)
- ✅ app.js → Enhanced with JSON import/export
- ✅ styles.css → Keep as-is

### Add
- ✅ Load JSON file button
- ✅ Download JSON button
- ✅ localStorage for session working data
- ✅ Example data JSON file

---

## 📊 Data Flow

```
┌─────────────────────────────────────┐
│    User Visits index.html           │
│    (GitHub Pages - Static)          │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  1. Load from localStorage (if has)  │
│  2. Show "Load File" button          │
│  3. User can upload JSON file        │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  User edits data in browser:        │
│  - Add income                        │
│  - Add expenses                      │
│  - Create budgets                    │
│  - All saved to localStorage         │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  User clicks "Download Data"        │
│  Gets JSON file with all data       │
│  Can save to computer               │
└─────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────┐
│  Next time they visit:              │
│  Click "Load File"                  │
│  Select their saved JSON            │
│  All data restored ✅               │
└─────────────────────────────────────┘
```

---

## 💾 JSON File Format

```json
{
  "version": "1.0",
  "exportDate": "2026-04-30T12:34:56Z",
  "income": [
    {
      "income_id": 1,
      "source_name": "Salary",
      "amount": 5000,
      "frequency": "monthly",
      "created_at": "2026-04-30T10:00:00Z"
    }
  ],
  "expenses": [
    {
      "expense_id": 1,
      "category": "Rent",
      "amount": 1500,
      "frequency": "monthly",
      "date": "2026-04-30",
      "created_at": "2026-04-30T10:00:00Z"
    }
  ],
  "savingsGoals": [
    {
      "id": 1234567890,
      "name": "Emergency Fund",
      "amount": 1000,
      "gain": 5
    }
  ],
  "budgets": [
    {
      "budget_id": 1,
      "budget_name": "April Budget",
      "income": [...],
      "expenses": [...],
      "created_at": "2026-04-30T10:00:00Z"
    }
  ]
}
```

---

## ✨ New Features

1. **Load File Button**
   - Click → Choose JSON file from computer
   - Auto-loads all data into app
   - Restores income, expenses, budgets, goals

2. **Download Data Button**
   - Click → Saves JSON file to computer
   - Named: `runway-backup-YYYY-MM-DD.json`
   - Contains all user data

3. **localStorage Backup**
   - Auto-saves to browser storage
   - If page refresh, data still there
   - If close browser and revisit, can reload from file

4. **No Login Needed**
   - Opens directly to app
   - One user per browser/file
   - No accounts, no passwords

---

## 📁 New File Structure

```
runway/
├── index.html          ← Converted from index.php
├── app.js              ← Enhanced with file I/O
├── styles.css          ← Same
├── manifest.json       ← PWA
├── sw.js               ← Service worker
├── example-data.json   ← Sample file for users
└── /docs               ← GitHub Pages deployment
    ├── index.html
    ├── app.js
    ├── styles.css
    └── manifest.json
```

---

## 🎯 Benefits

✅ **Fully Static** - Works on GitHub Pages, no backend needed
✅ **Privacy** - Data never leaves user's computer
✅ **Portable** - Users can save/load JSON anywhere
✅ **Fast** - localStorage makes it instant
✅ **Simple** - No MySQL, no PHP, no authentication
✅ **Offline** - Works without internet (PWA + localStorage)

---

## 🚀 Implementation Steps

1. Convert index.php to index.html
2. Remove all PHP includes
3. Add file upload input
4. Add download button
5. Enhance app.js with:
   - localStorage persistence
   - JSON import function
   - JSON export function
6. Remove api calls, use localStorage only
7. Create example JSON file
8. Deploy to GitHub Pages

---

## ⚡ Ready?

This will be **much simpler** and actually **better** for a static site!

Should I implement this?
