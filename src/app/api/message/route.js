import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
export const GET = async (request) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  const foundIndex = DB.messages.findIndex((room) => room.roomId === roomId);
  if (foundIndex === -1)
    return NextResponse.json(
      { ok: false, message: `Room is not found` },
      { status: 404 }
    );
  const roomMessages = DB.messages.filter((room) => room.roomId === roomId);
  return NextResponse.json(
    { ok: false, messages: roomMessages },
    { status: 200 }
  );
};
export const POST = async (request) => {
  const body = await request.json();
  const { roomId, messageText } = body;
  readDB();
  const foundIndex = DB.messages.findIndex((room) => room.roomId === roomId);
  if (foundIndex === -1)
    return NextResponse.json(
      { ok: false, message: `Room is not found` },
      { status: 404 }
    );
  const messageId = nanoid();
  DB.messages.push({ roomId, messageId, messageText });
  writeDB();
  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
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
  if (role !== "SUPER_ADMIN")
    return NextResponse.json(
      { ok: false, message: "Invalid token" },
      { status: 401 }
    );

  const body = await request.json();
  const { messageId } = body;
  readDB();
  const foundIndex = DB.messages.findIndex(
    (message) => message.messageId === messageId
  );
  if (foundIndex === -1)
    return NextResponse.json(
      { ok: false, message: "Message is not found" },
      { status: 404 }
    );
  DB.messages.splice(foundIndex, 1);
  writeDB();
  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
