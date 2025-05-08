"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import StringData from "@/data/string";

interface Props {
  logoutAction: () => void;
  username: string;
}

export default function Navbar({ logoutAction, username }: Props) {
  const initial = username?.[0]?.toUpperCase() || "U";

  return (
    <header className="w-full bg-white dark:bg-black shadow-sm sticky top-0 z-50 rounded-xl border-2 border-black">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {StringData.brand_name}
        </h2>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-9 h-9 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition"
              >
                {initial}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem disabled>@{username}</DropdownMenuItem>
              <DropdownMenuItem onClick={logoutAction}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
