import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";

type Paste = {
  content: string;
  max_views: number;
  views: number;
  created_at: number;
  expires_at: number | null;
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ FIX

  const key = `paste:${id}`;
  const paste = await redis.get<Paste>(key);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  // View limit check
  if (paste.views >= paste.max_views) {
    await redis.del(key);
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  // Increment views
  paste.views += 1;
  await redis.set(key, paste);

  return NextResponse.json({
    content: paste.content,
    views_left: paste.max_views - paste.views,
  });
}
