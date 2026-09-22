# 🌱 AgriLink – AI-Powered Direct Agriculture Marketplace

> **From Farm to Buyer. Direct. Smart. Transparent.**
> Connecting farmers directly with verified commercial buyers using computer vision crop identification, seasonal intelligence, and smart matching.

---

## 🚀 Where and How to Open the App

The application is already built and running locally on your computer!

### 1. Open in Web Browser
Click or navigate to:
👉 **[http://localhost:5173/](http://localhost:5173/)** (or `http://127.0.0.1:5173/`)

### 2. Backend API & Interactive Swagger Docs
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 📦 Project Structure

```
edvc/
├── backend/                  # FastAPI Python Backend
│   ├── main.py               # REST API & endpoints
│   ├── ai_engine.py          # AI models (Crop ID, Recs, Price Trends, Smart Match)
│   ├── database.py           # Demo seed data (Farmers, Buyers, Listings, Orders)
│   └── uploads/              # Uploaded crop images
│
├── frontend/                 # React 19 + TypeScript + Vite UI
│   ├── src/
│   │   ├── components/       # UI Views & Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── LandingHero.tsx
│   │   │   ├── CropIdentificationView.tsx
│   │   │   ├── WhatShouldIGrowView.tsx
│   │   │   ├── PriceIntelligenceView.tsx
│   │   │   ├── SmartMatchingView.tsx
│   │   │   ├── MarketplaceView.tsx
│   │   │   ├── FarmerDashboardView.tsx
│   │   │   ├── BuyerDashboardView.tsx
│   │   │   ├── OrdersView.tsx
│   │   │   ├── FarmMapView.tsx
│   │   │   ├── AdminDashboardView.tsx
│   │   │   ├── AgriAssistModal.tsx
│   │   │   └── ChatModal.tsx
│   │   ├── i18n.ts           # Multilingual (English, Telugu, Hindi)
│   │   ├── api.ts            # Client API bridge
│   │   ├── App.tsx           # Main Application controller
│   │   └── index.css         # Modern agriculture design system
│   └── package.json
└── README.md
```

---

## 🏃 Running the Application (If Restarting)

### Start Backend (Terminal 1):
```bash
cd backend
python -m uvicorn main:app --port 8000 --reload
```

### Start Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

---

## 🌐 Git & GitHub Setup

To push this repository to your GitHub account:

1. Create a new repository on [GitHub.com](https://github.com/new) (e.g. `agrilink-ai-marketplace`).
2. Run these commands in your project folder (`c:\Users\Mounika\OneDrive\Desktop\edvc`):

```bash
git init
git add .
git commit -m "Initial commit: AgriLink AI Agriculture Marketplace"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```
