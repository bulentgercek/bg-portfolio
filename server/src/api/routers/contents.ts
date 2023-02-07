import { Router } from "express";
import { z } from "zod";
import { dsm } from "../../connections";
import { Content } from "../../entities/Content";
import ApiResults from "../validations/apiResults";

const router = Router();

// Get all contents - with only query
router.get("/api/contents/", async (req, res) => {
  const queryResults = await dsm
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
    .catch((e) => res.json(e));

  res.json(queryResults);
});

// Get spesific content with id
router.get("/api/contents/:id", async (req, res) => {
  const apiResults = new ApiResults();

  await apiResults
    .validate(
      z.object({
        id: z.preprocess(Number, z.number()),
      }),
      req.params,
    )
    .then(async (result) => {
      await result.find(Content, {
        where: {
          id: result.results.validateResults.id, //parseInt(req.params.id),
        },
        relations: ["asset"],
      });
    });

  res.json(apiResults.results);
});

export { router as contentRouter };

// // Get all contents - With filtering after the query - total manuplation!
// router.get("/api/contents-wf/", async (req, res) => {
//   await dsm
//     .find(Content, {
//       relations: {
//         asset: true,
//       },
//     })
//     .then((data) => {
//       const filteredData = data.map((contents) => ({
//         ...contents,
//         asset: contents.asset.map((asset) => ({
//           name: asset.name,
//         })),
//       }));
//       res.json(filteredData);
//     });
// });

// // Get all contents - with the querybuilder
// router.get("/api/contents-wqb/", async (req, res) => {
//   await dsm
//     .createQueryBuilder(Content, "contents")
//     .leftJoinAndSelect("contents.asset", "asset")
//     .select(["contents.id", "contents.columns", "asset.name"])
//     .getMany()
//     .then((data) => res.json(data))
//     .catch((e) => console.log(e));
// });
