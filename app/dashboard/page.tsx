"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
  if (!isAuthenticated) return null;

  // Fake Data
  const fakeRoom = {
    id: "alpha-team",
    createdBy: "admin_user",
    members: ["alice", "bob", "charlie"],
  };

  const projects = [
    {
      id: "project-1",
      name: "Onboarding Flow",
      progress: 70,
      tasks: [
        { id: "t1", title: "Design UI", done: true },
        { id: "t2", title: "Implement API", done: false },
        { id: "t3", title: "Integrate frontend", done: false },
      ],
    },
    {
      id: "project-2",
      name: "Bug Hunt",
      progress: 40,
      tasks: [
        { id: "t4", title: "Fix login error", done: true },
        { id: "t5", title: "Resolve UI glitch", done: false },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Welcome, {user?.username} ({user?.email})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Room: <Badge>{fakeRoom.id}</Badge>
          </p>
          <p className="text-sm text-muted-foreground">
            Admin: {fakeRoom.createdBy} | Members: {fakeRoom.members.join(", ")}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <Progress value={project.progress} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              {project.tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2">
                  <Checkbox checked={task.done} disabled />
                  <span
                    className={
                      task.done ? "line-through text-muted-foreground" : ""
                    }
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
