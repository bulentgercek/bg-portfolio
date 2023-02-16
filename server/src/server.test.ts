import request from "supertest";

import server from "./server";

describe("GET /", () => {
  it("responds with a json message", (done) => {
    request(server)
      .get("/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "Welcome to the BG Portfolio Server",
        },
        done,
      );
  });
});
