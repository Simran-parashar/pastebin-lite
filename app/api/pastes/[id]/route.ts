export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await redis.get<any>(key);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  const currentTime = Date.now();

  // ⏳ Time-based expiry
  if (paste.expires_at && currentTime > paste.expires_at) {
    await redis.del(key);
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  // 👁 View-based expiry
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
