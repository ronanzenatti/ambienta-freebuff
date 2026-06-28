/**
 * Next.js Proxy (Middleware) — i18n + Authentication
 *
 * Next.js 16 renamed Middleware to Proxy. This file handles:
 * 1. Internationalization routing (via next-intl)
 * 2. Protected-route redirect based on JWT session cookie
 * 3. Authenticated-user redirect away from login page
 */
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { decrypt } from "./lib/auth/session";

// next-intl handles locale detection and prefixing
const handleI18n = createMiddleware(routing);

// ─── Route definitions ───────────────────────────────────────────────────────

const protectedPrefixes = ["/dashboard"];
const authPages = ["/login"];

function pathWithoutLocale(path: string): string {
  return path.replace(/^\/(en|pt-BR)/, "") || "/";
}

// ─── Proxy handler ───────────────────────────────────────────────────────────

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const base = pathWithoutLocale(pathname);

  // 1. Session check (read cookie directly from request — fast, no I/O)
  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);
  const isAuthenticated = !!session?.userId;

  // 2. Protected routes — redirect to login
  if (
    protectedPrefixes.some((prefix) => base.startsWith(prefix)) &&
    !isAuthenticated
  ) {
    const locale = pathname.startsWith("/en") ? "en" : "pt-BR";
    const loginUrl = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Auth pages (login) — redirect to dashboard if already authenticated
  if (
    authPages.some((page) => base === page) &&
    isAuthenticated
  ) {
    const locale = pathname.startsWith("/en") ? "en" : "pt-BR";
    const dashboardUrl = new URL(`/${locale}/dashboard`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 4. Delegate to next-intl middleware
  return handleI18n(req);
}

export const config = {
  // Match all pathnames except API, Next.js internals, and static files
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
