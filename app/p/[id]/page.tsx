type Paste = {
  content: string;
  views_left: number;
};

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ IMPORTANT: await params
  const { id } = await params;

  const res = await fetch(
    `http://localhost:3000/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Paste not found or expired</h2>
      </div>
    );
  }

  const data: Paste = await res.json();

  return (
    <div style={{ padding: 40 }}>
      <h2>Your Paste</h2>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 6,
          whiteSpace: "pre-wrap",
        }}
      >
        {data.content}
      </pre>

      <p>Views left: {data.views_left}</p>
    </div>
  );
}
