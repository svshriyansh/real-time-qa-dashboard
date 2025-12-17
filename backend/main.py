from fastapi import FastAPI, WebSocket, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime
from jose import jwt
import asyncio
from pydantic import BaseModel
from dotenv import load_dotenv
import os
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()
ADMIN_USER = {
    "username": os.getenv("ADMIN_USERNAME"),
    "password": os.getenv("ADMIN_PASSWORD")
}


class ResponseRequest(BaseModel):
    response: str

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Data Stores ----------------
questions = []
clients = []

# ---------------- Auth ----------------
security = HTTPBearer()


def create_token(username: str):
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm="HS256")

def verify_admin(creds: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=["HS256"])
        if payload.get("sub") != "admin":
            raise Exception()
    except:
        raise HTTPException(status_code=401, detail="Unauthorized")

# ---------------- Admin Login ----------------
@app.post("/admin/login")
def admin_login(username: str, password: str):
    if username == ADMIN_USER["username"] and password == ADMIN_USER["password"]:
        return {"token": create_token(username)}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ---------------- WebSocket ----------------
@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.append(ws)
    try:
        while True:
            await asyncio.sleep(60)  # keep alive
    except Exception:
        pass
    finally:
        if ws in clients:
            clients.remove(ws)

# ---------------- Submit Question ----------------
@app.post("/questions")
async def submit_question(message: str):
    if not message.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    question = {
        "id": len(questions) + 1,
        "message": message,
        "status": "Pending",
        "timestamp": datetime.now().isoformat(),
        "responses": []
    }

    questions.append(question)

    for client in clients:
        await client.send_json(question)

    return question

# ---------------- Get Questions ----------------
@app.get("/questions")
def get_questions():
    priority = {"Escalated": 0, "Pending": 1, "Answered": 2}
    return sorted(
        questions,
        key=lambda q: (priority[q["status"]], q["timestamp"]),
        reverse=True
    )

# ---------------- Escalate (Guest) ----------------
@app.put("/questions/{qid}/escalate")
async def escalate_question(qid: int):
    for q in questions:
        if q["id"] == qid:
            q["status"] = "Escalated"
            for client in clients:
                await client.send_json(q)
            return q
    raise HTTPException(status_code=404, detail="Not found")

# ---------------- Respond (Guest/Admin) ----------------
@app.post("/questions/{qid}/respond")
async def respond(qid: int, data: ResponseRequest):
    for q in questions:
        if q["id"] == qid:
            q["responses"].append({
                "text": data.response,
                "time": datetime.now().isoformat()
            })

            # realtime update
            for client in clients:
                await client.send_json(q)

            return q

    raise HTTPException(status_code=404, detail="Not found")

# ---------------- Mark Answered (Admin Only) ----------------
@app.put("/questions/{qid}/answer")
async def mark_answered(qid: int, admin=Depends(verify_admin)):
    for q in questions:
        if q["id"] == qid:
            q["status"] = "Answered"
            for client in clients:
                await client.send_json(q)
            return q
    raise HTTPException(status_code=404, detail="Not found")
