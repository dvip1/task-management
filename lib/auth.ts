import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define your constants (matching those used in login system)
const COOKIE_NAME = process.env.TOKEN_SECRET || "session_token"; // Make sure this matches your login system's cookie name

interface JWTPayload {
  user: {
    id: string;
    username: string;
    email: string;
  };
  iat: number;
  exp: number;
}

export function getTokenFromCookie(req: NextRequest) {
  // Get the cookie from the request
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  return cookieValue;
}

export async function verifyAuth(req: NextRequest) {
  try {
    // Try to get token from cookie first
    const token = getTokenFromCookie(req);

    // If no token in cookie, check authorization header as fallback (optional)
    if (!token) {
      return { authorized: false, error: "No authentication token found" };
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JWTPayload;

    return { authorized: true, user: decoded.user };
  } catch (error) {
    console.log("Authentication error:", error);
    return { authorized: false, error: "Invalid token" };
  }
}

// Example usage (from your provided code snippet)
/*
const { authorized, user, error } = await verifyAuth(req);
if (!authorized) {
  console.log("User is unauthorized");
  return NextResponse.json({ message: error }, { status: 401 });
}
console.log("User is authorized");
*/
