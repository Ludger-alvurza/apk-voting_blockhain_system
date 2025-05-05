import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get auth cookie from request
    const cookies = request.headers.get("cookie") || "";
    const authTokenCookie = cookies
      .split(";")
      .find((c) => c.trim().startsWith("auth_token="));

    // Check if auth token exists
    if (authTokenCookie) {
      // Token exists, user is authenticated
      return NextResponse.json({
        isAuthenticated: true,
      });
    } else {
      // No token found
      return NextResponse.json({
        isAuthenticated: false,
      });
    }
  } catch (error: unknown) {
    console.error("Error in auth check:", error);
    return NextResponse.json({
      isAuthenticated: false,
      error: "Failed to check authentication status",
    });
  }
}
