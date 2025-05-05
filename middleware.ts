// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require authentication
const PROTECTED_PATHS = ["/vote", "/results"];

export function middleware(request: NextRequest) {
  // Check if the requested path is protected
  const path = request.nextUrl.pathname;

  if (PROTECTED_PATHS.some((protectedPath) => path.startsWith(protectedPath))) {
    // Check if the user is authenticated by looking for auth cookie
    const authToken = request.cookies.get("auth_token")?.value;

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
  matcher: ["/vote/:path*", "/results/:path*"],
};
