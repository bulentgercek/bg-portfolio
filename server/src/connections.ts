import mysql from "mysql";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Content } from "./entity/Content";
import { Media } from "./entity/Media";

export function dbUrlParser(envUrl: string) {
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
 * Database Connector
 * @param envUrl Must be defined process.env.DATABASE_URL string
 * @returns mysql.Connection object
 */
export function dbConnection(envUrl: string): mysql.Connection {
  const dbUrl = dbUrlParser(envUrl);
  // Set the database config and initialize database connection -> db
  const db: mysql.Connection = mysql.createConnection({
    host: dbUrl.dbHost,
    user: dbUrl.dbUsername,
    password: dbUrl.dbPassword,
    database: dbUrl.dbName,
    port: dbUrl.dbPort,
  });

  db.connect((error) => {
    if (error) {
      console.error(`Error connecting to the database : ${error.stack}`);
      return;
    }
    console.log(
      `Connected to the database ${db.config.database} on ${db.config.host}:${db.config.port} with ${db.config.user} user and thread id is ${db.threadId}.`
    );
  });

  return db;
}

/**
 * TypeORM Data Source Connector
 * @param envUrl Must be defined process.env.DATABASE_URL string
 * @returns DataSource object
 */
export function dsConnection(envUrl: string): DataSource {
  const dbUrl = dbUrlParser(envUrl);

  const dataSource = new DataSource({
    type: "mysql",
    host: dbUrl.dbHost,
    port: dbUrl.dbPort,
    username: dbUrl.dbUsername,
    password: dbUrl.dbPassword,
    database: dbUrl.dbName,
    entities: [Media, Content],
    synchronize: true,
    logging: false,
    migrations: [],
    subscribers: [],
  });

  dataSource.initialize();

  return dataSource;
}
