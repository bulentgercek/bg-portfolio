import express from "express";
import { Content } from "../../entity/Content";
import { ds } from "../../connections";

const router = express.Router();

// Get all contents
router.get("/api/contents/", async (req, res) => {
  await ds.manager
    .find(Content, {
      relations: ["asset"],
    })
    .then((data) => res.json(data));
});

// Get spesific content with id
router.get("/api/contents/:id", async (req, res) => {
  await ds.manager
    .find(Content, {
      where: {
        id: parseInt(req.params.id),
      },
      relations: ["asset"],
    })
    .then((data) => res.json(data));
});

export { router as contentRouter };
