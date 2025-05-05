import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Hapus cookie autentikasi
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Set cookie untuk expired agar browser menghapusnya
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Failed to process logout" },
      { status: 500 }
    );
  }
}
