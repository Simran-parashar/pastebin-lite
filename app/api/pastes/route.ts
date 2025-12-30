import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { now } from "@/lib/time";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, max_views = 1, ttl_seconds } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const id = nanoid(8);
    const createdAt = now(req);

    const paste = {
      content,
      max_views,
      views: 0,
      created_at: createdAt,
      expires_at: ttl_seconds
        ? createdAt + ttl_seconds * 1000
        : null,
    };

    await redis.set(`paste:${id}`, paste);

    return NextResponse.json({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create paste" },
      { status: 500 }
    );
  }
}
