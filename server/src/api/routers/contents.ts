import express from "express";
import { Content } from "../../entity/Content";
import { ds, dsm } from "../../connections";
import { Asset } from "../../entity/Asset";

const router = express.Router();

// Get all contents - with only query
router.get("/api/contents/", async (req, res) => {
  await dsm
    .find(Content, {
      select: {
        asset: {
          name: true,
        },
      },
      relations: {
        asset: true,
      },
    })
    .then((data) => res.json(data));
});

// Get all contents - With filtering after the query - total manuplation!
router.get("/api/contents-wf/", async (req, res) => {
  await dsm
    .find(Content, {
      relations: {
        asset: true,
      },
    })
    .then((data) => {
      const filteredData = data.map((contents) => ({
        ...contents,
        asset: contents.asset.map((asset) => ({
          name: asset.name,
        })),
      }));
      res.json(filteredData);
    });
});

// Get all contents - with the querybuilder
router.get("/api/contents-wqb/", async (req, res) => {
  await dsm
    .createQueryBuilder(Content, "contents")
    .leftJoinAndSelect("contents.asset", "asset")
    .select(["contents.id", "contents.columns", "asset.name"])
    .getMany()
    .then((data) => res.json(data))
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
