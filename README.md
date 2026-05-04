# 🕐 PartTimePal

<div align="center">

![PartTimePal Banner](https://img.shields.io/badge/PartTimePal-Job%20Matching%20Platform-6366f1?style=for-the-badge&logo=briefcase&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)

**A full-stack platform connecting part-time job seekers with employers — powered by AI-driven job recommendations, real-time chat, and multilingual support.**

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Firebase-powered auth for job seekers & recruiters |
| 💼 **Job Posting** | Recruiters post and manage part-time job listings |
| 🤖 **AI Recommendations** | ML-based job matching using cosine similarity & Sentence Transformers |
| 💬 **Real-time Chat** | Socket.IO powered messaging between seekers and recruiters |
| 🌐 **Multilingual** | English ↔ Hindi translation for job listings (NLP) |
| 🗺️ **Location Aware** | Geo-based job filtering using haversine distance |
| 📊 **Smart Search** | TF-IDF & semantic embedding search with Gemini AI field-weighting |
| 📁 **File Uploads** | Resume/document uploads via Multer |
| ⚡ **Redux Persistence** | Seamless state management across sessions |

---

## 🏗️ Architecture

```
PartTimePal/
├── backend/          # Node.js + Express REST API + Socket.IO
├── frontend/         # React 18 + Vite + TailwindCSS
└── ML/               # Python FastAPI ML service
```

```
┌─────────────────┐     HTTP/WS      ┌──────────────────┐
│   React Frontend │ ◄────────────► │  Express Backend  │
│   (Vite + Redux) │                 │  (Node.js :5000)  │
└─────────────────┘                 └────────┬──────────┘
                                             │ HTTP
                                    ┌────────▼──────────┐
                                    │  FastAPI ML Service│
                                    │   (Python :8000)   │
                                    └────────┬──────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │  MongoDB Atlas  +  Firebase  │
                              └─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.9+
- **MongoDB Atlas** account (or local MongoDB)
- **Firebase** project (for authentication)

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend runs on **http://localhost:5000**

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the development server:

```bash
npm run dev
```

The frontend runs on **http://localhost:5173**

---

### 3️⃣ ML Service Setup

```bash
cd ML

# Create and activate a virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in `ML/` (if using Gemini API):

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI server:

```bash
python main.py
```

The ML service runs on **http://localhost:8000**

---

## 🔌 API Endpoints

### Backend (Express) — Port 5000

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/jobs` | Fetch all job listings |
| `POST` | `/api/postjob` | Post a new job |
| `GET` | `/api/jobseekers` | Get job seeker profiles |
| `GET` | `/api/rec` | Get recruiter profiles |
| `POST` | `/api/message` | Send a message |
| `POST` | `/api/accept` | Accept/reject job application |

### ML Service (FastAPI) — Port 8000

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/recommends` | Get content-based job recommendations |
| `POST` | `/recommend_by_text` | Semantic text-based job search |
| `POST` | `/translate-job` | Translate job data (EN ↔ HI) |
| `POST` | `/add-job` | Add a new job to the ML dataset |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — UI framework
- **TailwindCSS v4** — Utility-first styling
- **Redux Toolkit** + **redux-persist** — State management
- **Zustand** — Lightweight local state
- **Socket.IO Client** — Real-time communication
- **Framer Motion** — Animations
- **Firebase** — Authentication
- **React Router v7** — Client-side routing
- **Axios** — HTTP client

### Backend
- **Node.js** + **Express.js** — REST API server
- **Socket.IO** — WebSocket real-time messaging
- **Mongoose** — MongoDB ODM
- **Multer** — File uploads
- **Morgan** — HTTP request logging
- **CORS** — Cross-Origin Resource Sharing

### ML Service
- **FastAPI** + **Uvicorn** — High-performance Python API
- **scikit-learn** — Cosine similarity, TF-IDF, KNN
- **Sentence Transformers** (`all-MiniLM-L6-v2`) — Semantic embeddings
- **Pandas** + **NumPy** — Data processing
- **geopy** — Geolocation & haversine distance
- **googletrans** — Translation API
- **Google Gemini AI** — Dynamic field weight generation for search
- **NLTK** (Porter Stemmer) — Text normalization

### Database & Infrastructure
- **MongoDB Atlas** — Primary database
- **Firebase** — Authentication & user management

---

## 📂 Project Structure

```
PartTimePal/
│
├── backend/
│   ├── app.js                # Express app entry point
│   ├── connection/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # Route handler logic
│   ├── model/                # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── lib/
│   │   └── socketio.js       # Socket.IO configuration
│   ├── scripts/              # Utility scripts (seed data, etc.)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Root component + routing
│   │   ├── main.jsx          # Entry point + Redux store setup
│   │   ├── pages/            # Page-level components
│   │   ├── components/       # Reusable UI components
│   │   ├── store/            # Redux slices & store config
│   │   ├── contexts/         # React context providers
│   │   ├── lib/              # Utility libraries (axios, firebase)
│   │   └── utils/            # Helper functions
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── ML/
    ├── main.py               # FastAPI app + ML endpoints
    ├── gemini.py             # Gemini AI integration
    ├── jobs_converted_utf8.csv  # Job dataset
    ├── joblist.json          # Structured bilingual job data
    ├── insertJobs.py         # Database seed script
    └── requirements.txt
```

---

## 🌍 Supported Cities

The ML recommendation engine supports geolocation-aware filtering for:

`Bangalore` · `Mysore` · `Mumbai` · `Pune` · `Delhi` · `Lucknow` · `Ahmedabad`

---

## 📸 Screenshots

> _Coming soon — run the app locally to explore the interface!_

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is for educational and personal use.

---

<div align="center">
Made with ❤️ · <b>PartTimePal</b> — Connecting talent with opportunity
</div>