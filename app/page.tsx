"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [maxViews, setMaxViews] = useState(3);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        max_views: maxViews,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data?.id) {
      router.push(`/p/${data.id}`);
    } else {
      alert("Failed to create paste");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        color: "#eaeaea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          padding: 30,
          backgroundColor: "#111",
          borderRadius: 8,
        }}
      >
        <h1 style={{ marginBottom: 5 }}>Pastebin Lite</h1>
        <p style={{ color: "#888", marginBottom: 20 }}>
          Create and share pastes that expire automatically
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Paste your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            required
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 6,
              backgroundColor: "#000",
              color: "#0f0",
              border: "1px solid #333",
              marginBottom: 15,
              fontFamily: "monospace",
            }}
          />

          <label style={{ fontSize: 14, color: "#aaa" }}>
            Max Views
          </label>

          <input
            type="number"
            min={1}
            value={maxViews}
            onChange={(e) => setMaxViews(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 5,
              marginBottom: 20,
              backgroundColor: "#000",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 6,
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              backgroundColor: "#22c55e",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 6,
              cursor: "pointer",
              border: "none",
            }}
          >
            {loading ? "Creating Paste..." : "Create Paste"}
          </button>
        </form>
      </div>
    </main>
  );
}
