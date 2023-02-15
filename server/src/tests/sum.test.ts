import { sum } from "./sum";

test("add 5 + 15 to equal 20", () => {
  expect(sum(5, 15)).toBe(20);
});
