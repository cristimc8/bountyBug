import { DataSource } from "typeorm";
import config from "@/config";
import { Employee } from "@/api/models/employee";
import { Role } from "@/api/models/role";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.database,
  synchronize: true,
  logging: true,
  entities: [Employee, Role],
  subscribers: [],
  migrations: [],
})
