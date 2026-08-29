import { Server } from "http";
import app from "./app";
import config from "./config";
import prisma from "./lib/prisma";
import {
  initiateReservationExpiredSweep,
  terminateReservationExpirySweep,
} from "./features/reservation/reservation.scheduler";
import { initiateSocket, terminateSocket } from "./lib/socket";

let server: Server;
const port = config.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log(`Prisma Client connected to ${config.NODE_ENV} database`);

    server = app.listen(port, () => {
      console.log(`App listening on port ${port} in ${config.NODE_ENV} mode`);
    });

    // attach socket.io to the same http server
    initiateSocket(server);
    console.log("Socket.io ready");

    // start the reservation cleaning which are expired
    initiateReservationExpiredSweep();
    
  } catch (err) {
    console.error(`Server failed to start: ${err}`);
    process.exit(1);
  }

  process.on("unhandledRejection", (reason) => {
    console.error(`Unhandled Rejection: ${reason}`);
    shutdown(1);
  });

  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err}`);
    shutdown(1);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully.");
    shutdown(0);
  });
}

function shutdown(code: number) {
  console.log("Shutting down server...");

  // stop the reservation sweep process
  terminateReservationExpirySweep();

  // close socket connections
  terminateSocket();

  if (server) {
    server.close(() => {
      console.log("Server shutdown complete");
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

startServer();
