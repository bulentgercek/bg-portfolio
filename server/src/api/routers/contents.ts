import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../apiController";
import { Content } from "../../entities/Content";

const router = Router();

// Get all contents - with only query
router.get("/api/contents/", async (req, res) => {
  const dbResults = await ac.find(Content, {
    relations: {
      asset: true,
    },
  });

  res.json(dbResults);
});

// Get spesific content with id
router.get("/api/contents/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: z.object({ id: z.preprocess(Number, z.number()) }),
    reqData: req.params,
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(
    Content,
    {
      where: {
        id: validateResults.result.id,
      },
      relations: {
        asset: true,
      },
    },
    validateResults,
  );

  res.json(dbResults);
});

export { router as contentRouter };

/**
 * Archive Codes
 */
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
