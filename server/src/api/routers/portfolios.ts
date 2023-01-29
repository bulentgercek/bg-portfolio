import express from "express";
import { Portfolio } from "../../entity/Portfolio";
import { ds } from "../../connections";

export const portfolioRouter = express.Router();

// Get all portfolios
portfolioRouter.get("/api/portfolios/", async (req, res) => {
  await ds.manager
    .find(Portfolio, {
      relations: ["portfolioCategory", "portfolioItem"],
    })
    .then((data) => res.json(data));
});
