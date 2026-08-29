import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";


export const ROOM_EVENTS = {
  JOIN: "room:join",
  LEAVE: "room:leave",
} as const;

let io: Server | null = null;


export function initiateSocket(httpServer: HttpServer): Server {
  if (io) return io;

  io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    socket.on(ROOM_EVENTS.JOIN, (room: string) => {
      if (typeof room === "string" && room) socket.join(room);
    });

    socket.on(ROOM_EVENTS.LEAVE, (room: string) => {
      if (typeof room === "string" && room) socket.leave(room);
    });
  });

  return io;
}


export function emitToRoom<TPayload>(
  room: string,
  event: string,
  payload: TPayload,
): void {
  io?.to(room).emit(event, payload);
}


export function terminateSocket(): void {
  io?.close();
  io = null;
}
