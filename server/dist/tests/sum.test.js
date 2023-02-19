"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sum_1 = require("./sum");
test("add 5 + 15 to equal 20", () => {
    expect((0, sum_1.sum)(5, 15)).toBe(20);
});
