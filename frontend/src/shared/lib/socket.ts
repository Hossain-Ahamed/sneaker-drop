import { io, type Socket } from "socket.io-client";
import config from "@/app/config";

export const ROOM_EVENTS = {
  JOIN: "room:join",
  LEAVE: "room:leave",
} as const;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(config.SOCKET_URL, { autoConnect: true });
  }
  return socket;
}

export function joinRoom(room: string): () => void {
  const s = getSocket();
  s.emit(ROOM_EVENTS.JOIN, room);

  const rejoin = () => s.emit(ROOM_EVENTS.JOIN, room);
  s.on("connect", rejoin);

  return () => {
    s.off("connect", rejoin);
    s.emit(ROOM_EVENTS.LEAVE, room);
  };
}

export function onEvent<TPayload>(
  event: string,
  handler: (payload: TPayload) => void,
): () => void {
  const s = getSocket();
  s.on(event, handler);
  return () => {
    s.off(event, handler);
  };
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
