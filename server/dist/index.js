"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const validEnv_1 = __importDefault(require("./validEnv"));
/**
 * Server Activation
 */
server_1.default.listen(validEnv_1.default.PORT, () => {
    console.log(`Server started and listening on port ${validEnv_1.default.PORT}.`);
});
