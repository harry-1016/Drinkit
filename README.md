# 🚀 DeliveryOS — Full PWA Delivery Platform

Three installable PWA apps sharing a single localStorage data store — works offline, no backend needed.

## Apps included
| App | Folder | URL |
|-----|--------|-----|
| 🛍️ Customer (QuickDrop) | `/customer` | `your-site.github.io/customer/` |
| 🚗 Driver (DriveOS) | `/delivery` | `your-site.github.io/delivery/` |
| ⚙️ Admin Panel | `/admin` | `your-site.github.io/admin/` |

---

## ⚡ Quick Start (Local)

```bash
# Clone and serve locally (must use a server — file:// doesn't support ES modules)
npx serve .
# Then open: http://localhost:3000
```

---

## 📦 GitHub Pages Setup (Step by Step)

### Step 1 — Create a GitHub Repo
1. Go to https://github.com/new
2. Name it `deliveryos` (or anything you like)
3. Set it **Public**
4. Click **Create repository**

### Step 2 — Upload files
Option A — GitHub web UI (easiest):
1. Open your new repo on GitHub
2. Click **Add file → Upload files**
3. Drag the entire `delivery-pwa` folder contents (all files + folders)
4. Commit with message `Initial commit`

Option B — Git CLI:
```bash
cd delivery-pwa
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/deliveryos.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** tab
2. Scroll to **Pages** section (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Branch: `main`, Folder: `/ (root)`
5. Click **Save**
6. Wait ~2 minutes, then visit: `https://YOUR_USERNAME.github.io/deliveryos/`

### Step 4 — Test all three apps
- Hub: `https://YOUR_USERNAME.github.io/deliveryos/`
- Customer: `https://YOUR_USERNAME.github.io/deliveryos/customer/`
- Driver: `https://YOUR_USERNAME.github.io/deliveryos/delivery/`
- Admin: `https://YOUR_USERNAME.github.io/deliveryos/admin/`

---

## 🔑 Admin Login
- **Email:** admin@deliveryos.com
- **Password:** admin123

---

## 📱 Install as PWA

### Android (Chrome):
1. Open the app URL in Chrome
2. Tap the **"Add to Home Screen"** banner or ⋮ menu → Install app

### iPhone (Safari):
1. Open in Safari
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**

---

## 🏗 Project Structure

```
delivery-pwa/
├── index.html              ← Hub / landing page
├── manifest.json           ← Root PWA manifest
├── sw.js                   ← Root service worker
├── _config.yml             ← GitHub Pages config
├── .nojekyll               ← Disables Jekyll processing
├── shared/
│   ├── store.js            ← Shared data store (ALL apps use this)
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── customer/
│   ├── index.html          ← Customer app
│   ├── manifest.json
│   └── sw.js
├── delivery/
│   ├── index.html          ← Driver app
│   ├── manifest.json
│   └── sw.js
└── admin/
    ├── index.html          ← Admin panel
    ├── manifest.json
    └── sw.js
```

---

## ⚙️ How Data Sync Works

All three apps read/write from the same `localStorage` keys:
- `dos_menu` — Menu items
- `dos_orders` — All orders
- `dos_users` — User profiles

Changes are broadcast instantly using the **BroadcastChannel API** — open Customer + Driver + Admin in separate tabs and watch them update in real time!

---

## 🛠 Customisation Guide

### Change restaurant name / colors
- Customer: Edit `--brand` variable and `.logo` in `customer/index.html`
- Driver: Edit `--brand` variable in `delivery/index.html`
- Admin: Edit `--brand` variable in `admin/index.html`

### Add real backend (Firebase/Supabase)
Replace the `Store` object in `shared/store.js` with API calls:
1. Replace `localStorage.getItem/setItem` with Firestore reads/writes
2. Replace `BroadcastChannel` with Firestore `onSnapshot` listeners
3. No other changes needed — all apps already use the Store interface

### Add real authentication
Replace the hardcoded user check in `admin/index.html` `doLogin()` with your auth provider (Firebase Auth, Supabase, etc.)

---

## 🚧 Limitations (localhost/GitHub Pages)

- Data is stored in **browser localStorage only** — not shared between devices or browsers
- To share data across devices: integrate Firebase Firestore (free tier is generous)
- PWA install prompt only appears on HTTPS — GitHub Pages provides HTTPS automatically

---

## 📋 Feature Checklist

### Customer App ✅
- [x] Browse menu with categories and search
- [x] Add/remove items from cart
- [x] Cart drawer with quantity controls
- [x] Place orders with delivery address
- [x] Order history with live status tracking
- [x] Progress bar per order status
- [x] PWA installable

### Driver App ✅
- [x] Online/offline toggle
- [x] See new order requests
- [x] Accept/skip orders
- [x] Step-by-step status updates (accepted → preparing → picked up → delivered)
- [x] Today's stats (deliveries, earnings)
- [x] Earnings history breakdown
- [x] PWA installable

### Admin App ✅
- [x] Secure login (email + password)
- [x] KPI dashboard (orders, revenue, today's count)
- [x] Top selling items with bar chart
- [x] Order status breakdown
- [x] Recent orders table
- [x] Full menu management (add/edit/delete/toggle availability)
- [x] All orders list with status override
- [x] PWA installable
