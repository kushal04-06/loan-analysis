# Deployment Guide

## 1) Deploy backend (Render/Railway)

Backend folder: `backend`

Build command:
- `npm install`

Start command:
- `npm start`

Environment variables:
- `PORT=5000` (platform may override)
- `CORS_ORIGIN=https://<your-frontend-domain>`
- `JWT_SECRET=<long-random-secret>`

After deploy, copy backend URL:
- Example: `https://loan-api.onrender.com`

## 2) Configure frontend API URL

File: `config.js`

Set production API base:
```js
const fallbackApiBase = isLocal
  ? "http://localhost:5000/api"
  : "https://loan-api.onrender.com/api";
```

## 3) Deploy frontend (Netlify/Vercel/GitHub Pages)

Publish root:
- `loan-analysis`

No build step required (static HTML/CSS/JS project).

## 4) Post-deploy test checklist

- Login works (`admin` + `kushal` for demo)
- Prediction page gets response from `/api/loan/predict`
- Analytics page loads dashboard using token
- Dashboard update saves via `PUT /api/dashboard`

## 5) Production notes

- Replace demo users with real user onboarding
- Move data from `data/store.json` to a real database
- Rotate `JWT_SECRET` periodically
