import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, max_views = 1, ttl_seconds } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const id = nanoid(8);
    const createdAt = Date.now();

    const paste = {
      content,
      max_views: Number(max_views),
      views: 0,
      created_at: createdAt,
      expires_at: ttl_seconds
        ? createdAt + Number(ttl_seconds) * 1000
        : null,
    };

    await redis.set(`paste:${id}`, paste);

    return NextResponse.json({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    });
  } catch (error) {
    console.error("CREATE PASTE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create paste" },
      { status: 500 }
    );
  }
}
