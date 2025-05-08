"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import { Home, Inbox, LogOutIcon, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import Routes from "@/data/routes";

interface Project {
  _id: string;
  name: string;
}

interface AppSidebarProps {
  roomId: string;
}

export function AppSidebar({ roomId }: AppSidebarProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [projectName, setProjectName] = useState("");

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(Routes.project + "?roomId=" + roomId);
        const data = await res.json();
        console.log(data.message);
        setProjects(data.message);
      } catch (err) {
        toast.error("Failed to fetch projects.");
      }
    };

    fetchProjects();
  }, []);
  const handleCreateProject = async () => {
    if (!projectName.trim()) return toast.error("Project name required.");
    try {
      const res = await fetch(Routes.project, {
        method: "POST",
        body: JSON.stringify({ name: projectName, roomId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Project creation failed");

      const newProject = await res.json();
      setProjects((prev) => [...prev, newProject]);
      setShowDialog(false);
      setProjectName("");
      toast.success("Project created.");
    } catch (err) {
      toast.error("Error creating project.");
    }
  };

  const navigateToProject = (projectId: string) => {
    router.push(`/room/${roomId}/project/${projectId}`);
  };

  const menuItems = [
    { title: "Search", url: "#", icon: Search },
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Logout", url: "#", icon: LogOutIcon },
  ];

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction
              title="Add Project"
              onClick={() => setShowDialog(true)}
            >
              <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects &&
                  projects?.map((project) => (
                    <SidebarMenuItem key={project._id}>
                      <SidebarMenuButton
                        onClick={() => navigateToProject(project._id)}
                      >
                        <span>{project.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Button onClick={handleCreateProject} className="w-full mt-2">
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
