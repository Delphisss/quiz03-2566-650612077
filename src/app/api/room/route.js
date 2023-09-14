import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();

  const rooms = DB.rooms;
  const totalRooms = rooms.length;

  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  const roomName = request.body.roomName;

  if (isRoomExists) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  readDB();

  const isRoomExists = DB.rooms.some((room) => room.name === roomName);

  if (isRoomExists) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();
  DB.rooms.push({ id: roomId, name: roomName });

  DB.rooms.push;

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
};

/*
export const GET = async () => {
  readDB();
  
  // Assuming DB.rooms contains an array of room objects, you can return them like this
  const rooms = DB.rooms;
  const totalRooms = rooms.length;

  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
  });
};


export const POST = async (request) => {
  const payload = checkToken();

  // Assuming the request body contains the room name, you can access it like this
  const roomName = request.body.roomName;

  readDB();

  // Check if the room name already exists in the database
  const isRoomExists = DB.rooms.some((room) => room.name === roomName);

  if (isRoomExists) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  // Assuming DB.rooms is an array, you can push the new room to it
  DB.rooms.push({ id: roomId, name: roomName });

  // Call writeDB after modifying the Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
 */
