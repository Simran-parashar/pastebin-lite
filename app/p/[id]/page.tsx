import { headers } from "next/headers";

type PasteResponse = {
  content: string;
  views_left: number;
};

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next.js 15: params is async
  const { id } = await params;

  // ✅ Get current host (localhost OR vercel domain)
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Host not found");
  }

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Paste not found or expired</h2>
      </div>
    );
  }

  const data: PasteResponse = await res.json();

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h2>Your Paste</h2>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {data.content}
      </pre>

      <p style={{ marginTop: 10 }}>
        Views left: {data.views_left}
      </p>
    </div>
  );
}
