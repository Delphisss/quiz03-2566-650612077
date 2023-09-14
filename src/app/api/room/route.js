import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
export const GET = async () => {
  readDB();
  const rooms = DB.rooms;
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: rooms.length,
  });
};

export const POST = async (request) => {
  let role = null;
  try {
    const payload = checkToken();
    role = payload.role;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid token" },
      { status: 401 }
    );
  }
  if (role !== "ADMIN" && role !== "SUPER_ADMIN")
    return NextResponse.json(
      { ok: false, message: "Invalid token" },
      { status: 401 }
    );

  const body = await request.json();
  const { roomName } = body;
  readDB();
  const foundIndex = DB.rooms.findIndex((room) => room.roomName == roomName);
  if (foundIndex >= 0)
    return NextResponse.json(
      { ok: false, message: `Room ${roomName} already exists` },
      { status: 400 }
    );

  const roomId = nanoid();
  DB.rooms.push({ roomId, roomName });
  writeDB();
  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
