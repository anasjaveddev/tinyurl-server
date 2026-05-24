# tinyurl-server

A REST API for a URL shortener built with **Node.js, Express, and MongoDB**. Accepts a long URL, stores it in the database, and returns a unique shortened URL. Works together with the [tinyurl-client](https://github.com/MohidWebDev/tinyurl-client.git) frontend.

## 🔗 Related Repository

This is the **backend** of a two-part project.
👉 Frontend repo: [tinyurl-client](https://github.com/MohidWebDev/tinyurl-client.git)

## 🛠️ Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- dotenv
- cors

## 📁 Folder Structure

```
tinyurl-server/
├── Controllers/
│   ├── SaveURL.js
│   └── RedirectURL.js
├── Models/
│   └── url.js
├── Routes/
│   └── urls.js
├── Utils/
│   ├── Keys.js
│   └── mongodb.js
├── .env
├── index.mjs
└── package.json
```

## ⚙️ Setup & Installation

1. Clone the repository

   ```bash
   git clone https://github.com/MohidWebDev/tinyurl-server.git
   cd tinyurl-server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory

   ```env
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the server

   ```bash
   node index.mjs
   ```

5. Server runs on `http://localhost:5050`

## 📡 API Endpoints

### `POST /save`

Saves a long URL and returns a shortened one.

**Request body:**

```json
{
  "longURL": "https://www.example.com/some/very/long/url"
}
```

**Success response:**

```json
{
  "ok": true,
  "shortURL": "http://localhost:5050/aB3xK9m"
}
```

**Error response:**

```json
{
  "ok": false
}
```

---

### `GET /:shortId`

Redirects to the original long URL associated with the given short ID.

**Example:**

```
GET http://localhost:5050/aB3xK9m
→ 302 Redirect to https://www.example.com/some/very/long/url
```

## 🔄 How It Works

1. A `POST /save` request comes in with a `longURL` in the body
2. A unique 7-character `shortId` is generated using `Keys.js`
3. The `longURL` and `shortId` are saved to MongoDB
4. The server responds with the full short URL
5. When a `GET /:shortId` request comes in, MongoDB is queried for the matching record and the user is redirected

## 📄 License

MIT
