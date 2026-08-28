import { Server } from 'http';
import app from './app';
import config from './config';
import prisma from './lib/prisma';

let server: Server;
const port = config.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log(`Prisma Client connected to ${config.NODE_ENV} database`);

    server = app.listen(port, () => {
      console.log(`App listening on port ${port} in ${config.NODE_ENV} mode`);
    });

  } catch (err) {
    console.error(`Server failed to start: ${err}`);
    process.exit(1);
  }

  process.on('unhandledRejection', reason => {
    console.error(`Unhandled Rejection: ${reason}`);
    shutdown(1);
  });

  process.on('uncaughtException', err => {
    console.error(`Uncaught Exception: ${err}`);
    shutdown(1);
  });
  
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    shutdown(0);
  });
}

function shutdown(code: number) {
  console.log('Shutting down server...');

  if (server) {
    server.close(() => {
      console.log('Server shutdown complete');
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
}

startServer();
