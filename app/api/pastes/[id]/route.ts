export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ REQUIRED in Next.js 15

  const key = `paste:${id}`;
  const paste = await redis.get<{
    content: string;
    max_views: number;
    views: number;
  }>(key);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  // 👁️ View-based expiry
  if (paste.views >= paste.max_views) {
    await redis.del(key);
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  paste.views += 1;
  await redis.set(key, paste);

  return NextResponse.json({
    content: paste.content,
    views_left: paste.max_views - paste.views,
  });
}
