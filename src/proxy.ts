import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Matcher entries are linked with a logical "or", therefore
  // if one of them matches, the proxy will be invoked.
  matcher: [
    // Match all pathnames except for:
    // - API routes (/api/*)
    // - tRPC routes (/trpc/*)
    // - Next.js internal routes (/_next/*)
    // - Vercel internal routes (/_vercel/*)
    // - Static files with a dot in the path (e.g. favicon.ico, *.svg, etc.)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
