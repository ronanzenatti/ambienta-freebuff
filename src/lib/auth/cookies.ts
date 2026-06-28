import "server-only";

import { cookies } from "next/headers";
import { decrypt, encrypt, type SessionPayload } from "./session";

export async function createSession(userId: string, role: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * Read and decrypt the session cookie on the server.
 * Returns undefined when no valid session exists (no redirect — caller decides).
 */
export async function getSession(): Promise<SessionPayload | undefined> {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return undefined;
  return decrypt(cookie);
}
