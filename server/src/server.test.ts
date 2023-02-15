import request from "supertest";

import server from "./server";

describe("GET /api", () => {
  it("responds with a json message", (done) => {
    request(server)
      .get("/api")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, { message: "Welcome to the BG Portfolio Server" }, done);
  });
  // afterAll((done) => {
  //   server.close(done);
  // });
});
