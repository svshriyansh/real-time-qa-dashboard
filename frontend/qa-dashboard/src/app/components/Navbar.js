'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./navbar.css";

export default function Navbar() {
    const router = useRouter();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    // Check auth on load
    useEffect(() => {
        setIsAdminLoggedIn(!!localStorage.getItem("token"));
    }, []);

    function logout() {
        localStorage.removeItem("token");
        setIsAdminLoggedIn(false);      // 🔥 force UI update
        router.push("/admin");          // redirect to login
    }

    function goToAdminLogin() {
        router.push("/admin");
    }

    return (
        <nav className="navbar">
            <div className="nav-left">
                <span className="logo" onClick={() => router.push("/")}>
                    Q&A System
                </span>

                <button onClick={() => router.push("/")}>Q&A</button>
                <button onClick={() => router.push("/dashboard")}>Dashboard</button>
            </div>

            <div className="nav-right">
                {!isAdminLoggedIn ? (
                    <button className="admin-btn" onClick={goToAdminLogin}>
                        Admin Login
                    </button>
                ) : (
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
