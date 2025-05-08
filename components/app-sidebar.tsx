import { Home, Inbox, LogOutIcon, Search } from "lucide-react";

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
import { Plus } from "lucide-react";

// Menu items.
const items = [
  // all tasks
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  //task assigned
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOutIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
          <SidebarGroupAction title="Add Project">
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
