# Real-Time Q&A Dashboard

A real-time Q&A system where guests can submit, view, respond, and escalate questions,
and admins can mark questions as answered.

## Tech Stack
- Frontend: Next.js (React)
- Backend: FastAPI
- Realtime: WebSockets
- Auth: JWT (Admin only)
- Storage: In-memory (can be extended to DB)

## Features
- Submit questions (AJAX XMLHttpRequest validation)
- Live dashboard with real-time updates
- Escalated questions move to the top
- Guests can respond and escalate
- Admin-only “Mark Answered”
- Admin notifications for new questions

## Running the Project

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
