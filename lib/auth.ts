import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JWTPayload {
  user: {
    id: string;
    username: string;
    email: string;
  };
  iat: number;
  exp: number;
}

export function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}

export async function verifyAuth(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return { authorized: false, error: "No token provided" };
    }

    // Specify the return type of jwt.verify
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JWTPayload;
    return { authorized: true, user: decoded.user };
  } catch (error) {
    console.log("This is error" + error);
    return { authorized: false, error: "Invalid token" };
  }
}
