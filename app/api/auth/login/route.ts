import connectDB from "@/lib/mongoose";
import userModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // Import the serialize function

interface UserPayload {
  id: string;
  username: string;
  email: string;
}

const TOKEN_EXPIRATION_SECONDS = 8 * 60 * 60; // 8 hours in seconds
const COOKIE_NAME = process.env.TOKEN_SECRET; // Choose a name for your cookie

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email?.trim() || !password?.trim()) {
      return new Response(JSON.stringify({ message: "All fields required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingUser = await userModel
      .findOne({ email })
      .select("_id username email password") // Ensure password is selected for comparison
      .lean() // Using lean for performance, but ensure _id is a string later
      .exec();

    if (!existingUser) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401, // Changed to 401 for consistency with failed auth
        headers: { "Content-Type": "application/json" },
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create a user payload without the password
    const userPayload: UserPayload = {
      id: existingUser._id.toString(), // Ensure _id is stringified
      username: existingUser.username,
      email: existingUser.email,
    };

    // Generate the JWT
    const token = jwt.sign(
      { user: userPayload }, // You can simplify this to just userPayload if preferred
      process.env.TOKEN_SECRET!,
      { expiresIn: `${TOKEN_EXPIRATION_SECONDS}s` }, // Use seconds for consistency
    );

    // Serialize the cookie
    const cookie = serialize(COOKIE_NAME, token, {
      httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
      maxAge: TOKEN_EXPIRATION_SECONDS, // Cookie expiry in seconds
      path: "/", // Cookie is available for all paths on your domain
      sameSite: "lax",
    });

    // Return the response, setting the cookie in the headers
    // The JSON body now only contains the user information and a success message.
    return new Response(
      JSON.stringify({
        message: "Login successful", // Optional success message
        user: userPayload, // Send user data for the client to update context
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie, // Set the serialized cookie here
        },
      },
    );
  } catch (err: any) {
    console.error("Login API error:", err);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? err.message
        : "An internal server error occurred during login.";

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
