"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPaste() {
    if (!content.trim()) {
      setError("Paste content cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    setLink(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("Failed to create paste");
      }

      const data = await res.json();
      setLink(data.url);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>📋 Pastebin Lite</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Create a paste and share it using a generated link.
      </p>

      <textarea
        placeholder="Write your paste content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />

      <br />
      <br />

      <button
        onClick={createPaste}
        disabled={loading}
        style={{
          padding: "10px 16px",
          fontSize: "14px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
      )}

      {link && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            borderRadius: "6px",
            background: "#f5f5f5",
          }}
        >
          <p style={{ marginBottom: "8px" }}>✅ Paste created successfully:</p>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", wordBreak: "break-all" }}
          >
            {link}
          </a>

          <br />
          <br />

          <button
            onClick={() => navigator.clipboard.writeText(link)}
            style={{
              padding: "6px 12px",
              fontSize: "13px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            📎 Copy Link
          </button>
        </div>
      )}
    </main>
  );
}
