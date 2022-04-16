import expressLoader from './express';
import Logger from './logger';
import './events';
import { AppDataSource } from "@/data-source";

export default async ({ expressApp }) => {
  const typeOrm = await AppDataSource.initialize();
  Logger.info('✌️ DB loaded and connected!');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
