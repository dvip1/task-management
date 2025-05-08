"use client";

import { useEffect, use } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TaskCard from "@/components/taskCard";
export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="container mx-auto p-4">Loading...</div>;
  if (!isAuthenticated) return null;

  const id = use(params);
  return (
    <SidebarProvider>
      <>
        <AppSidebar roomId={id.slug} />
        <SidebarTrigger />
        <MainBody />
      </>
    </SidebarProvider>
  );
}

const MainBody = () => {
  const a = true;
  if (a) return BodyContent();
  return BlankPage();
};

const BlankPage = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full ">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Nothing to see here!
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        create a project & a task to start!
      </p>
    </div>
  );
};

const BodyContent = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-10">
      <h1 className="mt-10 scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl flex items-center">
        All Tasks
      </h1>
      <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>
      <h1 className="mt-10 scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl flex items-center">
        Statistics
      </h1>
    </div>
  );
};
