import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "./cookies";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Verify that a valid session exists.
 * Redirects to /login when the session is missing or invalid.
 * The result is memoised per render pass via React's cache().
 */
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }
  return { isAuth: true as const, userId: session.userId, role: session.role };
});

/**
 * Return the currently authenticated user (safe fields only).
 * Redirects to /login when not authenticated.
 */
export const getCurrentUser = cache(async (): Promise<SafeUser> => {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
});
