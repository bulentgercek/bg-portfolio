"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dsConnection = exports.dbUrlParser = exports.dsm = exports.ds = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Content_1 = require("./entities/Content");
const Asset_1 = require("./entities/Asset");
const validEnv_1 = __importDefault(require("./validEnv"));
const PortfolioItem_1 = require("./entities/PortfolioItem");
const PortfolioCategory_1 = require("./entities/PortfolioCategory");
const Portfolio_1 = require("./entities/Portfolio");
/**
 * Data Source initilization for TypeORM
 */
exports.ds = dsConnection(validEnv_1.default.DATABASE_URL);
exports.dsm = exports.ds.manager;
/**
 * Enviroment variable DATABASE_URL parser
 * to use it in TypeORM Source Connector
 * @param envUrl Enviroment url
 * @returns object
 */
function dbUrlParser(envUrl) {
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
exports.dbUrlParser = dbUrlParser;
/**
 * TypeORM Data Source Connector
 * @param envUrl Must be defined process.env.DATABASE_URL string
 * @returns DataSource object
 */
function dsConnection(envUrl) {
    const dbUrl = dbUrlParser(envUrl);
    const dataSource = new typeorm_1.DataSource({
        type: "mysql",
        host: dbUrl.dbHost,
        port: dbUrl.dbPort,
        username: dbUrl.dbUsername,
        password: dbUrl.dbPassword,
        database: dbUrl.dbName,
        entities: [Asset_1.Asset, Content_1.Content, PortfolioItem_1.PortfolioItem, PortfolioCategory_1.PortfolioCategory, Portfolio_1.Portfolio],
        synchronize: true,
        logging: false,
        migrations: [],
        subscribers: [],
    });
    dataSource.initialize();
    return dataSource;
}
exports.dsConnection = dsConnection;
