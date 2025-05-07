import userModel from "@/models/userModel";
import connectDB from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();

    if (!username?.trim() || !email?.trim() || !password?.trim())
      return new Response(JSON.stringify({ message: "All fields required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    else if (password.length < 8)
      return new Response(
        JSON.stringify({ message: "Password must be at least 8 characters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );

    const existingUser = await userModel.findOne({ email }).lean().exec();
    if (existingUser)
      return new Response(JSON.stringify({ message: "Email already in use" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const user = await userModel.create({
      username,
      email,
      password,
    });

    if (user)
      return new Response(
        JSON.stringify({ message: "User created successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    else
      return new Response(JSON.stringify({ message: "Error creating user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
  } catch (err: any) {
    console.error("Registration error:", err);
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred during registration";

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
