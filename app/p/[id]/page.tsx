type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PastePage({ params }: PageProps) {
  const { id } = await params; // ✅ FIX

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <h1 style={{ color: "red" }}>Paste not found or expired</h1>;
  }

  const data = await res.json();

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {data.content}
      </pre>
      <p>Views left: {data.views_left}</p>
    </main>
  );
}
