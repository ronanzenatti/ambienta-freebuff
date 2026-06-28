import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/cookies";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's safe fields,
 * or 401 when not authenticated.
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
