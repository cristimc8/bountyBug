import expressLoader from './express';
import sequelizeLoader from './sequelize';
import Logger from './logger';
import './events';

export default async ({ expressApp }) => {
  const sequelize = await sequelizeLoader();
  try {
    await sequelize.authenticate();
    Logger.info('✌️ DB loaded and connected!');
  } catch (error) {
    Logger.error('Unable to connect to database: ', error);
    console.error('Unable to connect to the database:', error);
  }

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
