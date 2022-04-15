import { Sequelize } from "sequelize";
import config from "@/config";

export default async (): Promise<Sequelize> => (
    new Sequelize(config.database, config.dbUsername, config.dbPassword, {
      dialect: "mysql"
    })
)

