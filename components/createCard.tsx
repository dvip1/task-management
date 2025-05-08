interface props {
  txt: string;
}
export default function CreateRoomCard({ txt }: props) {
  return (
    <div className="border-dashed border-2 border-gray-400 rounded-xl p-4 flex flex-col justify-center items-center text-gray-600 hover:bg-gray-100 cursor-pointer transition">
      <div className="text-4xl">＋</div>
      <p className="mt-2 font-medium">{txt}</p>
    </div>
  );
}
