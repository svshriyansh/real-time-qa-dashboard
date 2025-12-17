# Real-Time Q&A Dashboard

A real-time question & answer dashboard where users can post questions and responses, and admins can manage question status with live updates.

## Features

### Guest Users

- Submit questions
- View all questions in real time
- Respond to questions
- Escalate questions

### Admin Users

- Login as admin
- Mark questions as answered
- Receive notifications when new questions arrive

### Real-Time Updates

- WebSockets used to push updates instantly
- Dashboard updates without refresh

## Tech Stack

- **Frontend:** Next.js (App Router), React
- **Backend:** FastAPI
- **Realtime:** WebSockets
- **Auth:** Token-based admin auth
- **Storage:** In-memory (as allowed by assignment)

## Question Status Flow

- `Pending`
- `Escalated` (moves to top)
- `Answered`

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
