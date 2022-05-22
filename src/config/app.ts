import * as http from "http";
import { socketsConnection } from "@/config/sockets";
import Logger from "@/loaders/logger";
import config from "@/config/index";
import sockets from "@/api/routes/sockets";

export const configServer = async ({ app, server }: { app: Express.Application, server: http.Server }) => {

  const ioConnection = await socketsConnection({ expressApp: app, server });
  sockets(ioConnection);

  await require('../loaders').default({ expressApp: app });
  Logger.info('✌️ Sockets loaded');

  Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
};
