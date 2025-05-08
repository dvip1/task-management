"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Routes from "@/data/routes";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type Room = {
  _id: string;
  name: string;
  members: string[];
};

interface Props {
  router: AppRouterInstance;
}
export default function RoomsPage({ router }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [createName, setCreateName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  useEffect(() => {
    fetch(Routes.rooms, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []));
  }, []);

  const handleCreate = async () => {
    if (!createName) return toast.error("Room name is required");

    try {
      const res = await fetch(Routes.rooms, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: createName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create room");
      }

      toast.success("Kindly Refresh!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleJoin = async () => {
    if (!joinRoomId) return toast.error("Room ID is required");

    try {
      const res = await fetch(Routes.rooms, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: joinRoomId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to join room");
      }

      toast.success("Kindly Refresh!");
      // Update UI or redirect
    } catch (err: any) {
      toast.error(err.message || "Unable to join room");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      {/* Top Actions */}
      <section className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        {/* Create Room */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              ➕ Create Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Join Room */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              🔗 Join Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join a Room</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
              />
              <Button onClick={handleJoin}>Join</Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Room Cards */}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => router.push(`/dashboard/${room._id}`)}
            className="border border-neutral-800 bg-white dark:bg-black rounded-xl p-4 cursor-pointer hover:shadow-md transition"
          >
            <h2 className="font-bold text-lg">{room.name}</h2>
            <p className="text-sm text-neutral-500 break-all">
              Room ID: {room._id}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
