import express from "express";
import { Portfolio } from "../../entity/Portfolio";
import { dsm } from "../../connections";

export const router = express.Router();

// Get all portfolios
router.get("/api/portfolios/", async (req, res) => {
  await dsm
    .find(Portfolio, {
      relations: ["portfolioCategory", "portfolioItem"],
    })
    .then((data) => res.json(data));
});

export { router as portfolioRouter };
