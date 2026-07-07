"use client";

import Button from "@/lib/auth/ui/Button";
import { useState } from "react";

export default function TestUsersPage() {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleRequest(
        url: string,
        method: string,
        body?: any
    ) {
        setLoading(true);
        setResponse(null);

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setResponse({ error: "Request failed" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 20, maxWidth: 600 }}>
            <h1>User API Tester</h1>

            {/* Inputs */}
            <input
                placeholder="User ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{ display: "block", marginBottom: 10 }}
            />
            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ display: "block", marginBottom: 10 }}
            />
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", marginBottom: 10 }}
            />

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                    onClick={() =>
                        handleRequest("/api/users", "POST", {
                            id,
                            name,
                            email,
                        })
                    }
                >
                    Create / Upsert
                </Button>

                <Button
                    onClick={() =>
                        handleRequest(`/api/users/${id}`, "GET")
                    }
                >
                    Get User
                </Button>

                <Button
                    onClick={() =>
                        handleRequest(`/api/users/${id}`, "PATCH", {
                            name,
                            email,
                        })
                    }
                >
                    Update User
                </Button>

                <Button
                    onClick={() =>
                        handleRequest(`/api/users/${id}`, "DELETE")
                    }
                >
                    Delete User
                </Button>
            </div>

            {/* Status */}
            {loading && <p>Loading...</p>}

            {/* Response */}
            <pre style={{ marginTop: 20 }}>
                {JSON.stringify(response, null, 2)}
            </pre>
        </div>
    );
}