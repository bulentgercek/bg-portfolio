import express from "express";
import { Portfolio } from "../../entity/Portfolio";
import { ds } from "../../connections";

export const router = express.Router();

// Get all portfolios
router.get("/api/portfolios/", async (req, res) => {
  await ds.manager
    .find(Portfolio, {
      relations: ["portfolioCategory", "portfolioItem"],
    })
    .then((data) => res.json(data));
});

export { router as portfolioRouter };
