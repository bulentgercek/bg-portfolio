import "reflect-metadata";
import { DataSource } from "typeorm";
import { Content } from "./entities/Content";
import { Asset } from "./entities/Asset";
import env from "./validEnv";
import { PortfolioItem } from "./entities/PortfolioItem";
import { PortfolioCategory } from "./entities/PortfolioCategory";
import { Portfolio } from "./entities/Portfolio";

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
function dbUrlParser(envUrl: string) {
  // Parse the database url to get the database credentials
  const [dbUsername, dbPassword, dbHost, dbPort, dbName] = envUrl
    .split(/mysql:|\/|:|@/)
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
function dsConnection(envUrl: string): DataSource {
  const dbUrl = dbUrlParser(envUrl);

  const dataSource = new DataSource({
    type: "mysql",
    host: dbUrl.dbHost,
    port: dbUrl.dbPort,
    username: dbUrl.dbUsername,
    password: dbUrl.dbPassword,
    database: dbUrl.dbName,
    entities: [Asset, Content, PortfolioItem, PortfolioCategory, Portfolio],
    synchronize: true,
    logging: false,
    migrations: [],
    subscribers: [],
  });

  dataSource.initialize();

  return dataSource;
}
