# 🔗 TinyURL Server

A production-ready URL shortener backend built with **Node.js**, **Express**, **MongoDB**, and **Redis**.

---

## 📁 Project Structure

```
tinyurl-server/
├── Controllers/
│   ├── SaveURL.js       # POST /save — Create short URL
│   └── RedirectURL.js   # GET /:shortId — Redirect to original URL
├── Models/
│   └── url.js           # Mongoose URL schema
├── Routes/
│   └── urls.js          # Express router
├── Utils/
│   ├── mongodb.js       # MongoDB connection
│   ├── redis.js         # Redis client with graceful fallback
│   └── Keys.js          # Short ID generator
├── .env                 # Environment variables
├── index.mjs            # Entry point
├── package.json
└── README.md
```

---

## ⚙️ Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Edit the `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/tinyurl
REDIS_URL=redis://localhost:6379
BASE_URL=http://localhost:5050
PORT=5050
```

### 3. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 🔌 API Endpoints

### `POST /save`
Creates a short URL.

**Request Body:**
```json
{
  "longURL": "https://www.example.com/very/long/url"
}
```

**Response (201):**
```json
{
  "success": true,
  "shortId": "aB3xY7z",
  "shortURL": "http://localhost:5050/aB3xY7z",
  "longURL": "https://www.example.com/very/long/url",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### `GET /:shortId`
Redirects to the original URL.

- ✅ Found → `302 Redirect` to `longURL`
- ❌ Not Found → `404 JSON`

```json
{
  "success": false,
  "message": "Short URL 'aB3xY7z' not found"
}
```

---

### `GET /health`
Health check endpoint.

```json
{
  "status": "OK",
  "message": "TinyURL Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🚀 Deploy on Railway

1. Push your code to a GitHub repository
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Add these environment variables in Railway dashboard:
   ```
   MONGODB_URI=<your MongoDB Atlas URI>
   REDIS_URL=<your Redis URL or leave empty>
   BASE_URL=https://<your-railway-domain>.railway.app
   PORT=5050
   ```
4. Railway auto-detects `npm start` from `package.json`

> **Tip:** Use [MongoDB Atlas](https://cloud.mongodb.com) for the database.  
> **Tip:** Redis is optional — the server runs fine without it.

---

## ⚡ Redis Caching

- Redis caches short ID → long URL mappings for **24 hours** (86400s)
- On cache **miss**, MongoDB is queried and result is cached
- If Redis is **unavailable**, the server falls back to MongoDB automatically
- No crash, no errors — fully graceful degradation

---

## 🛠️ Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Runtime   | Node.js 18+        |
| Framework | Express 4          |
| Database  | MongoDB + Mongoose |
| Cache     | Redis 4            |
| Deploy    | Railway            |
