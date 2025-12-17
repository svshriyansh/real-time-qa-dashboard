import { sortQuestions } from "./sortQuestions";

const BASE_URL = "http://127.0.0.1:8000";

export function fetchQuestions() {
    return fetch(`${BASE_URL}/questions`).then(res => res.json());
}

export function escalateQuestion(id, setQuestions) {
    return fetch(`${BASE_URL}/questions/${id}/escalate`, {
        method: "PUT"
    })
        .then(res => res.json())
        .then(updated =>
            setQuestions(prev =>
                sortQuestions(prev.map(q => (q.id === id ? updated : q)))
            )
        );
}

export function markQuestionAnswered(id, setQuestions) {
    return fetch(`${BASE_URL}/questions/${id}/answer`, {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    })
        .then(res => res.json())
        .then(updated =>
            setQuestions(prev =>
                sortQuestions(prev.map(q => (q.id === id ? updated : q)))
            )
        );
}

export function submitQuestionResponse(id, text, setQuestions, clearInput) {
    if (!text || !text.trim()) return;

    fetch(`${BASE_URL}/questions/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: text })
    })
        .then(res => res.json())
        .then(updated => {
            setQuestions(prev =>
                sortQuestions(prev.map(q => (q.id === id ? updated : q)))
            );
            clearInput();
        });
}
