"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import RoomsPage from "@/components/page/roomPage";
import Navbar from "@/components/Navbar";

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
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Navbar logoutAction={logout} username={user?.username || ""} />
      <RoomsPage router={router} />
    </div>
  );
}
