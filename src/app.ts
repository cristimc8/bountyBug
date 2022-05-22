import 'reflect-metadata';

import express from 'express';

import Logger from './loaders/logger';
import { configServer } from "@/config/app";
import config from "@/config";

async function startServer() {
  const app = express();

  const server = app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Starting server on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
  await configServer({ app, server });
}

startServer();
