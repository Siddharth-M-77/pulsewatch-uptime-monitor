import { NextResponse, type NextRequest } from "next/server";

// Protect /dashboard routes — redirect to /login when no session cookie exists.
// This is a fast cookie-presence gate; the JWT is fully verified inside pages
// and API routes via getSession().
export function proxy(req: NextRequest) {
  const hasSession = req.cookies.get("pw_session");
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
