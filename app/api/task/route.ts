import { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import taskModel from "@/models/taskModel";
import projectModel from "@/models/projectModel";
import userModel from "@/models/userModel";

/*
POST: Create tasks via username

GET: Fetch tasks by projectId.

PATCH: Update tasks.

PUT: Assign users to tasks

DELETE: Remove tasks.

*/

// get tasks

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "Missing projectId in query params" }),
        { status: 400 },
      );
    }

    const tasks = await taskModel
      .find({ project: projectId })
      .populate("assignedTo", "username");
    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// create task
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, description, projectId } = await req.json();

    if (!title || !projectId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    // Confirm project exists
    const project = await projectModel.findById(projectId);
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
      });
    }

    // Create the task without assigned users
    const task = await taskModel.create({
      project: project._id,
      title,
      description,
      assignedTo: [],
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Task created", task }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Task creation failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// update tasks
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { taskId, status } = await req.json();
    if (!taskId || !status) {
      return new Response(
        JSON.stringify({ error: "Missing taskId or updates" }),
        { status: 400 },
      );
    }

    const updates = { status: status, updatedAt: new Date() };
    const task = await taskModel.findByIdAndUpdate(taskId, updates, {
      new: true,
    });

    if (!task)
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify({ message: "Task updated", task }), {
      status: 200,
    });
  } catch (err) {
    console.error("PATCH error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { taskId } = await req.json();

    if (!taskId) {
      return new Response(JSON.stringify({ error: "Missing taskId" }), {
        status: 400,
      });
    }

    const task = await taskModel.findByIdAndDelete(taskId);
    if (!task)
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify({ message: "Task deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.error("DELETE error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// assign tasks
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { taskId, username } = await req.json();

    if (!taskId || !username) {
      return new Response(
        JSON.stringify({ error: "Missing taskId or username" }),
        { status: 400 },
      );
    }

    const user = await userModel.findOne({ username });
    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });

    const task = await taskModel.findById(taskId);
    if (!task)
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });

    if (!task.assignedTo.includes(user._id)) {
      task.assignedTo.push(user._id);
      task.updatedAt = new Date();
      await task.save();
    }

    return new Response(
      JSON.stringify({ message: "User assigned to task", task }),
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
