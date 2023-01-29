import express from "express";
import { Content } from "../../entity/Content";
import { ds } from "../../connections";

export const contentRouter = express.Router();

// Get all contents
contentRouter.get("/api/contents/", async (req, res) => {
  await ds.manager
    .find(Content, {
      relations: ["asset"],
    })
    .then((data) => res.json(data));
});

// Get spesific content with id
contentRouter.get("/api/contents/:id", async (req, res) => {
  await ds.manager
    .find(Content, {
      where: {
        id: parseInt(req.params.id),
      },
      relations: ["asset"],
    })
    .then((data) => res.json(data));
});
