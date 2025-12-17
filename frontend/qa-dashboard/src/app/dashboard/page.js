'use client';

import { useEffect, useState, useRef } from "react";
import "./dashboard.css";

import { fetchQuestions } from "@/utils/questionApi";
import {
    escalateQuestion,
    markQuestionAnswered,
    submitQuestionResponse
} from "@/utils/questionApi";
import { sortQuestions } from "@/utils/sortQuestions";
import { isAdminUser } from "@/utils/auth";

export default function Dashboard() {
    const [questions, setQuestions] = useState([]);
    const [responseText, setResponseText] = useState({});
    const isAdmin = isAdminUser();
    const seenQuestionIds = useRef(new Set());

    // Initial load + polling
    useEffect(() => {
        const load = () =>
            fetchQuestions().then(data => {
                data.forEach(q => seenQuestionIds.current.add(q.id));
                setQuestions(sortQuestions(data));
            });

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, []);

    // WebSocket
    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:8000/ws");

        ws.onmessage = (event) => {
            const q = JSON.parse(event.data);

            setQuestions(prev =>
                sortQuestions([...prev.filter(x => x.id !== q.id), q])
            );

            if (
                isAdmin &&
                q.status === "Pending" &&
                !seenQuestionIds.current.has(q.id)
            ) {
                alert("🔔 New question received");
                seenQuestionIds.current.add(q.id);
            }
        };

        return () => ws.close();
    }, [isAdmin]);

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Live Q&A Dashboard</h1>

            {questions.map(q => (
                <div key={q.id} className="card">
                    <div className="card-header">
                        <p className="question">{q.message}</p>
                        <span className={`badge ${q.status.toLowerCase()}`}>
                            {q.status}
                        </span>
                    </div>

                    <p className="timestamp">
                        {new Date(q.timestamp).toLocaleString()}
                    </p>

                    {q.responses?.map((r, idx) => (
                        <p key={idx} className="response">💬 {r.text}</p>
                    ))}

                    <input
                        className="response-input"
                        style={{ color: "#000" }}
                        value={responseText[q.id] || ""}
                        placeholder={
                            q.status === "Answered"
                                ? "This question is marked as answered"
                                : "Write a response..."
                        }
                        disabled={q.status === "Answered"}
                        onChange={(e) =>
                            setResponseText(prev => ({
                                ...prev,
                                [q.id]: e.target.value
                            }))
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            submitQuestionResponse(
                                q.id,
                                responseText[q.id],
                                setQuestions,
                                () =>
                                    setResponseText(prev => ({ ...prev, [q.id]: "" }))
                            )
                        }
                    />

                    <button
                        className="btn btn-answer"
                        disabled={q.status === "Answered"}
                        onClick={() =>
                            submitQuestionResponse(
                                q.id,
                                responseText[q.id],
                                setQuestions,
                                () =>
                                    setResponseText(prev => ({ ...prev, [q.id]: "" }))
                            )
                        }
                    >
                        Submit
                    </button>

                    <div className="actions">
                        <button
                            className="btn btn-escalate"
                            onClick={() => escalateQuestion(q.id, setQuestions)}
                        >
                            Escalate
                        </button>

                        {isAdmin && (
                            <button
                                className="btn btn-answer"
                                onClick={() => markQuestionAnswered(q.id, setQuestions)}
                            >
                                Mark Answered
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
