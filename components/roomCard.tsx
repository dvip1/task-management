interface Props {
  room: { _id: string; name: string };
}

export default function RoomCard({ room }: Props) {
  return (
    <div className="border rounded-xl p-4 hover:shadow transition cursor-pointer">
      <h3 className="text-lg font-semibold">{room.name}</h3>
      <p className="text-sm text-gray-600">ID: {room._id.slice(-6)}</p>
    </div>
  );
}
