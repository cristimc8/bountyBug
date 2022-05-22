import { Server } from "socket.io";

export const socketsConnection = async ({ expressApp, server }) => {
  const io = new Server();
  expressApp.io = io;

  expressApp.io.listen(server, {
    cors: {
      origin: '*',
    }
  });

  return io;
};
