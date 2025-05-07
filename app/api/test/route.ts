import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { authorized, user, error } = await verifyAuth(req);
  if (!authorized) {
    console.log("user has logged in:" + user);
    return NextResponse.json({ message: error }, { status: 401 });
  }

  return new NextResponse(JSON.stringify({ hello: "world" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
