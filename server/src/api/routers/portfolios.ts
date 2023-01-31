import express from "express";
import { Portfolio } from "../../entity/Portfolio";
import { Content } from "../../entity/Content";
import { dsm } from "../../connections";

export const router = express.Router();

// Get all portfolios
router.get("/api/portfolios/", async (req, res) => {
  await dsm
    .find(Portfolio, {
      relations: ["portfolioCategory", "portfolioItem"],
    })
    .then(async (data) => {
      const contents = await dsm.find(Content, { relations: ["portfolioItem"] });
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

router.get("/api/portfolios-test/", async (req, res) => {
  const portfolios = await dsm
    .createQueryBuilder(Portfolio, "portfolio")
    .leftJoinAndSelect("portfolio.contents", "content") // LEARN THIS!
    .getMany();

  res.json(portfolios);
});

export { router as portfolioRouter };
