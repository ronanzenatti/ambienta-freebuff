/**
 * Core JWT session management (encrypt / decrypt).
 * No 'server-only' here — imported by both Proxy (Edge/Node) and Server Actions.
 */
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  userId: string;
  role: string;
}

const secretKey = process.env.SESSION_SECRET ?? "dev-secret-change-in-production-123456";
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | undefined> {
  if (!session) return undefined;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return undefined;
  }
}
