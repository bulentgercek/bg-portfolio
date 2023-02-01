import express from "express";
import { Portfolio } from "../../entity/Portfolio";
import { Content } from "../../entity/Content";
import { dsm } from "../../connections";

export const router = express.Router();

router.get("/api/portfolios/", async (req, res) => {
  await dsm
    .find(Portfolio, {
      relations: {
        portfolioCategory: true,
        portfolioItem: {
          content: true,
        },
      },
    })
    .then((data) => res.json(data))
    .catch((e) => console.log(e));
});

// Get all portfolios - with filtering and adding extra Content - total manuplation!
router.get("/api/portfolios-wf/", async (req, res) => {
  await dsm
    .find(Portfolio, {
      relations: { portfolioCategory: true, portfolioItem: true },
    })
    .then(async (data) => {
      const contents = await dsm.find(Content, {
        relations: { portfolioItem: true },
      });
      const newData = data.map((portfolio) => ({
        ...portfolio,
        contents: contents.map((contents) => ({
          id: contents.id,
          name: contents.name,
          columns: contents.columns,
          portfolioItemId: contents.portfolioItem.id,
        })),
      }));
      res.json(newData);
    });
});

export { router as portfolioRouter };
