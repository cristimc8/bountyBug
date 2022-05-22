import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Logger from "@/loaders/logger";

export default (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  io.on('connection', async (socket) => {
    Logger.info(`Connected client -> ${socket.id}`);

    socket.on('disconnect', () => {
      Logger.info(`Disconnected client -> ${socket.id}`);
    })

    socket.on('bugEvent', () => {
      return io.emit('refresh');
    })

    socket.on('adminEvent', () => {
      return io.emit('admin');
    })
  })
}
