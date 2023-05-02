import "reflect-metadata";
import { DataSource } from "typeorm";

import env from "./validEnv";
import { Content } from "./entities/Content";
import { Asset } from "./entities/Asset";
import { Item } from "./entities/Item";
import { Category } from "./entities/Category";
import { Option } from "./entities/Option";

/**
 * Data Source Type and Name for TypeORM
 * Just change this area if you want to change the database type
 * (e.g. mysql, postgres, sqlite, etc.)
 */
const dsType = "postgres";
const dsName = "postgresql";

/**
 * Data Source initilization for TypeORM
 */
export const ds: DataSource = dsConnection(env.DATABASE_URL);
export const dsm = ds.manager;

/**
 * Enviroment variable DATABASE_URL parser
 * to use it in TypeORM Source Connector
 * @param envUrl Enviroment url
 * @returns object
 */
export function dbUrlParser(envUrl: string) {
  // Parse the database url to get the database credentials
  const [dbUsername, dbPassword, dbHost, dbPort, dbName] = envUrl
    .split(new RegExp(dsName + ":|\\/|:|@"))
    .filter((n) => n);

  return {
    dbUsername,
    dbPassword,
    dbHost,
    dbPort: parseInt(dbPort, 10),
    dbName,
  };
}

/**
 * TypeORM Data Source Connector
 * @param envUrl Must be defined process.env.DATABASE_URL string
 * @returns DataSource object
 */
export function dsConnection(envUrl: string): DataSource {
  const dbUrl = dbUrlParser(envUrl);
  const dataSource = new DataSource({
    type: dsType,
    host: dbUrl.dbHost,
    port: dbUrl.dbPort,
    username: dbUrl.dbUsername,
    password: dbUrl.dbPassword,
    database: dbUrl.dbName,
    entities: [Asset, Content, Item, Category, Option],
    synchronize: true,
    logging: false,
    migrations: [],
    subscribers: [],
  });

  dataSource.initialize();

  return dataSource;
}
