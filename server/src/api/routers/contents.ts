import express from "express";
import { Content } from "../../entity/Content";
import { dsm } from "../../connections";

const router = express.Router();

// Get all contents
router.get("/api/contents/", async (req, res) => {
  await dsm
    .find(Content, {
      relations: ["asset"],
    })
    .then((data) => {
      const filteredData = data.map((content) => ({
        ...content,
      }));
      res.json(data);
    })
    .catch((e) => console.log(e));
});

// Get spesific content with id
router.get("/api/contents/:id", async (req, res) => {
  await dsm
    .find(Content, {
      where: {
        id: parseInt(req.params.id),
      },
      relations: ["asset"],
    })
    .then((data) => res.json(data));
});

export { router as contentRouter };
