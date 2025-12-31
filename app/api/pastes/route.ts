export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { content, max_views = 1 } = await req.json();

  if (!content) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  const id = nanoid(8);

  await redis.set(`paste:${id}`, {
    content,
    max_views,
    views: 0,
  });

  return NextResponse.json({
    id,
    url: `/p/${id}`,
  });
}
