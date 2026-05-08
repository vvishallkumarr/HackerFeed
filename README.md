# HackerFeed — MERN Full-Stack App

A full-stack MERN application that scrapes the top 10 stories from [Hacker News](https://news.ycombinator.com), stores them in MongoDB, and presents them through a polished React frontend with JWT authentication and bookmarking.

---

## ✨ Features

- **Web Scraper** — Cheerio-based scraper pulls the top 10 HN stories (title, URL, points, author, posted time) on server start and via a manual API trigger
- **JWT Authentication** — Register, login, and protected routes with Bearer tokens
- **Stories API** — Fetch all stories sorted by points (descending), with pagination support
- **Bookmarks** — Authenticated users can toggle bookmarks on stories; persisted to MongoDB
- **React Context** — Global auth state managed via `AuthContext`
- **Pagination** — `GET /api/stories?page=1&limit=10`
- **Clean UI** — Dark editorial theme with loading skeletons, toast notifications, and responsive design

---

## 🗂 Folder Structure

```
hn-fullstack/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, getMe
│   │   ├── scraperController.js # HN scraper logic
│   │   └── storiesController.js # Stories CRUD + bookmarks
│   ├── middleware/
│   │   └── auth.js             # JWT protect middleware
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt, bookmarks)
│   │   └── Story.js            # Story schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── stories.js          # /api/stories/*
│   │   └── scrape.js           # /api/scrape
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── StoryCard.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js  # Global auth state (React Context)
    │   ├── hooks/
    │   │   └── useStories.js   # Stories fetch + bookmark logic
    │   ├── pages/
    │   │   ├── StoriesPage.js
    │   │   ├── BookmarksPage.js
    │   │   ├── LoginPage.js
    │   │   └── RegisterPage.js
    │   ├── utils/
    │   │   └── api.js          # Axios instance with interceptors
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/hn_scraper` |
| `JWT_SECRET` | Secret for signing JWTs | `change_me_in_production` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `NODE_ENV` | Environment | `development` |

### Frontend — `frontend/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/hn-fullstack.git
cd hn-fullstack
```

### 2. Set up the Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev        # uses nodemon for hot-reload
# or: npm start   # production mode
```

The server starts on `http://localhost:5000`.  
On startup it **automatically scrapes** the top 10 HN stories.

### 3. Set up the Frontend

```bash
cd ../frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api  (already set)
npm install
npm start
```

The React app starts on `http://localhost:3000` and proxies API calls to port 5000.

---

## 📡 API Reference

### Auth

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ username, email, password }` | — | Register a new user |
| POST | `/api/auth/login` | `{ email, password }` | — | Login, returns JWT |
| GET | `/api/auth/me` | — | ✅ Bearer | Get current user |

### Stories

| Method | Endpoint | Query | Auth | Description |
|---|---|---|---|---|
| GET | `/api/stories` | `?page=1&limit=10` | Optional | All stories, sorted by points desc |
| GET | `/api/stories/:id` | — | Optional | Single story |
| POST | `/api/stories/:id/bookmark` | — | ✅ Required | Toggle bookmark |
| GET | `/api/stories/bookmarks` | — | ✅ Required | User's bookmarked stories |

### Scraper

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/scrape` | — | Trigger a fresh scrape of HN |

### Health Check

```
GET /api/health → { status: "OK", timestamp: "..." }
```

---

## 🎯 Bonus Features Implemented

- ✅ **Pagination** — `GET /api/stories?page=1&limit=10`
- ✅ **Rate limiting** — 100 requests per 15 minutes per IP
- ✅ **Input validation** — `express-validator` on all auth routes
- ✅ **Optional auth** — Story list shows bookmark state when logged in
- ✅ **Axios interceptors** — Auto-attach token; redirect on 401
- ✅ **Loading skeletons** — Polished UX while data loads
- ✅ **Toast notifications** — Feedback on all user actions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| State | React Context API |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Scraping | Axios + Cheerio |
| Validation | express-validator |

---

## 📦 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env.example`

### Deploy Frontend to Vercel

1. Create a new project on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

---

## 📝 License

MIT
