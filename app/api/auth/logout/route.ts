import { serialize } from "cookie";

export async function POST() {
  // Create an expired cookie to remove the session
  const cookie = serialize("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // Expire immediately
    path: "/",
    sameSite: "lax",
  });

  return new Response(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
    },
  });
}
