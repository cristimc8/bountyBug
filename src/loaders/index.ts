import expressLoader from './express';
import Logger from './logger';
import './events';
import { AppDataSource } from "@/data-source";
import dependencyInjector from "@/loaders/dependencyInjector";

export default async ({ expressApp }) => {
  await AppDataSource.initialize();
  Logger.info('✌️ DB loaded and connected!');

  await dependencyInjector();
  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
