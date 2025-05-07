import connectDB from "@/lib/mongoose";
import ProjectModel from "@/models/projectModel";
import { verifyAuth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const { authorized, user, error } = await verifyAuth(req);
  if (!authorized) {
    console.log("user has logged in:" + user);
    return NextResponse.json({ message: error }, { status: 401 });
  }

  const body = await req.json();
  const { name, roomId } = body;

  try {
    const newProject = await ProjectModel.create({
      name,
      roomId,
      createdAt: new Date(),
    });

    return new NextResponse(
      JSON.stringify({ message: "Project created", project: newProject }),
      { status: 201 },
    );
  } catch (error: any) {
    console.log(
      process.env.NODE_ENV === "development"
        ? error?.message
        : "An error occured while creating rooms",
    );
    return new NextResponse(
      JSON.stringify({ error: "Failed to create project" }),
      {
        status: 500,
      },
    );
  }
}
