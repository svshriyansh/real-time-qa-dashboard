# Real-Time Q&A Dashboard

A real-time Question & Answer dashboard where users can post questions and responses, and admins can manage question status with live updates. The system uses WebSockets to provide instant updates without page refresh.

---

## 🚀 Features

### 👤 Guest Users

- Submit questions
- View all questions in real time
- Respond to questions
- Escalate questions

### 🔐 Admin Users

- Login as admin
- Mark questions as answered
- Receive notifications when new questions arrive

### ⚡ Real-Time Updates

- WebSockets push updates instantly
- Dashboard updates automatically without refresh
- Escalated questions move to the top of the list

---

## 🧱 Tech Stack

- **Frontend:** Next.js (App Router), React
- **Backend:** FastAPI
- **Realtime:** WebSockets
- **Authentication:** Token-based admin authentication
- **Storage:** In-memory (as allowed by the assignment)

---

## 🔄 Question Status Flow

- `Pending`
- `Escalated` (higher priority, shown at top)
- `Answered`

Questions are sorted by:

1. Status priority (`Escalated` → `Pending` → `Answered`)
2. Most recent timestamp

---

## 🛠️ Setup Instructions

### 📌 Prerequisites

- Node.js (v18+ recommended)
- Python (v3.9+ recommended)
- npm

---

### 🔧 Backend Setup

cd backend
python -m venv venv
source venv/bin/activate # macOS / Linux

# venv\Scripts\activate # Windows

pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at:

http://127.0.0.1:8000

---

### 🔧 Frontend Setup

- cd frontend/qa-dashboard
- npm install
- npm run dev

Frontend runs at:

http://localhost:3000

---

🔐 Environment Variables

Create a .env file inside the backend/ directory:

SECRET_KEY=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

🔑 Admin Login

Use the following credentials:

Username: admin
Password: admin123
