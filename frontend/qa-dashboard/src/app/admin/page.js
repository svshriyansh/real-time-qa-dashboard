'use client';

import { useState } from "react";
import "./admin.css";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function login() {
        if (!username || !password) return;

        fetch(
            `http://127.0.0.1:8000/admin/login?username=${username}&password=${password}`,
            { method: "POST" }
        )
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                localStorage.setItem("token", data.token);
                alert("Logged in as Admin");
            })
            .catch(() => alert("Invalid credentials"));
    }

    return (
        <div className="admin-container">
            <h2>Admin Login</h2>

            <input
                placeholder="Username"
                style={{ color: "#ffffff" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
            />

            <input
                type="password"
                style={{ color: "#ffffff" }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
            />

            <button onClick={login}>Login</button>
        </div>
    );
}
