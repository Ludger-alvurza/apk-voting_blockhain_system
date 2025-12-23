// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require authentication
const PROTECTED_PATHS = ["/vote", "/results"];

// Paths that should NOT be accessible when logged in
const AUTH_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get("auth_token")?.value;

  // Redirect logged-in users away from login/register pages
  if (AUTH_PATHS.some((authPath) => path.startsWith(authPath))) {
    if (authToken) {
      // User is logged in, redirect to vote page
      return NextResponse.redirect(new URL("/vote", request.url));
    }
  }

  // Check if the requested path is protected
  if (PROTECTED_PATHS.some((protectedPath) => path.startsWith(protectedPath))) {
    if (!authToken) {
      // Redirect to the login page if not authenticated
      const url = new URL("/login", request.url);
      url.searchParams.set("from", path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Define which paths this middleware should run on
export const config = {
  matcher: ["/vote/:path*", "/results/:path*", "/login", "/register"],
};
