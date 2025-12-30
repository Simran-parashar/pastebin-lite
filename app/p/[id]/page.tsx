type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div>Paste not found or expired</div>;
  }

  const data = await res.json();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Paste</h1>
      <pre>{data.content}</pre>
      <p>Views left: {data.views_left}</p>
    </main>
  );
}
