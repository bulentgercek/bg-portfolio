"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noRouteFound = void 0;
function noRouteFound(req, res) {
    res.status(404);
    res.json({
        message: `No route not found at ${req.originalUrl}.`,
    });
}
exports.noRouteFound = noRouteFound;
