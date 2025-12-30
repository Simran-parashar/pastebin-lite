import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { now } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = `paste:${id}`;

  const paste = await redis.get<any>(key);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  const currentTime = now(req);

  if (paste.expires_at && currentTime > paste.expires_at) {
    await redis.del(key);
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

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

