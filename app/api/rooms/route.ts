import connectDB from "@/lib/mongoose";
import UserModel from "@/models/userModel";
import RoomModel from "@/models/roomModel";
import { verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// create
export async function POST(req: NextRequest) {
  const { authorized, user, error } = await verifyAuth(req);
  if (!authorized) {
    console.log("user has logged in:" + user);
    return NextResponse.json({ message: error }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const { name } = body;
  const email = user?.email;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const newRoom = await RoomModel.create({
      name,
      admin: user._id,
      members: [user._id],
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "Room created", roomId: newRoom._id }),
      { status: 201 },
    );
  } catch (error: any) {
    console.log(
      process.env.NODE_ENV === "development"
        ? error?.message
        : "An error occured while creating rooms",
    );
    return new NextResponse(
      JSON.stringify({ error: "Failed to create room" }),
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  const { authorized, user, error } = await verifyAuth(req);

  if (!authorized) {
    console.log("it is unauthoized");
    return NextResponse.json({ message: error }, { status: 401 });
  }
  console.log("it is authoized");
  await connectDB();
  const email = user?.email;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const rooms = await RoomModel.find({ members: user._id });
    return new Response(JSON.stringify({ rooms }), { status: 200 });
  } catch (error: any) {
    console.log(
      process.env.NODE_ENV === "development"
        ? error?.message
        : "An error occured while creating rooms",
    );
    return new Response(JSON.stringify({ error: "Failed to fetch rooms" }), {
      status: 500,
    });
  }
}

// Join in room
export async function PUT(req: NextRequest) {
  const { authorized, user, error } = await verifyAuth(req);
  if (!authorized) {
    console.log("user has logged in:" + user);
    return NextResponse.json({ message: error }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const { roomId } = body;
  const email = user?.email;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });

    const room = await RoomModel.findOne({ roomId });
    if (!room)
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 404,
      });

    const alreadyMember = room.members.includes(user._id);
    if (alreadyMember) {
      return new Response(JSON.stringify({ message: "User already in room" }), {
        status: 200,
      });
    }

    room.members.push(user._id);
    await room.save();

    return new Response(
      JSON.stringify({ message: "User added to room", room }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to join room" }), {
      status: 500,
    });
  }
}
