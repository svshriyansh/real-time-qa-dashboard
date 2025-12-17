'use client';

import { useState } from "react";
import "./qa.css";

export default function AskQuestion() {
  const [question, setQuestion] = useState("");

  function submitQuestion() {
    if (!question.trim()) {
      alert("Question cannot be empty");
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `http://127.0.0.1:8000/questions?message=${encodeURIComponent(question)}`
    );

    xhr.onload = () => {
      if (xhr.status === 200) {
        setQuestion("");
        alert("✅ Question submitted");
      } else {
        alert("Failed to submit question");
      }
    };

    xhr.onerror = () => alert("Network error");
    xhr.send();
  }


  return (
    <div className="qa-container">
      <h2>Ask a Question</h2>

      <input
        placeholder="Type your question here..."
        style={{ color: "#ffffff" }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submitQuestion()}   // ✅ ENTER
      />

      <button onClick={submitQuestion}>Submit</button>
    </div>
  );
}
