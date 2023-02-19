"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const api_1 = __importDefault(require("./api"));
const errorHandler_1 = require("./errorHandler");
/**
 *  Server initialization and configuration
 */
const server = (0, express_1.default)();
server.use((0, helmet_1.default)());
server.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
server.use(express_1.default.json());
server.get("/", (req, res) => {
    res.json({
        message: "Welcome to the BG Portfolio Server",
    });
});
// Api Router
server.use("/api", api_1.default);
// Next router for error handling
server.use(errorHandler_1.noRouteFound);
exports.default = server;
