import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Content } from "../../entities/Content";

const router = Router();

// Get all contents - with only query
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbResults = await ac.findAll(Content, validateResults, {
    select: {
      portfolioItem: {
        id: true,
      },
    },
    relations: {
      portfolioItem: true,
      asset: true,
    },
  });

  res.json(dbResults);
});

// Get spesific content with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResults = await ac.findOne(Content, validateResults, {
    relations: {
      asset: true,
    },
  });

  res.json(dbResults);
});

router.put("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: z.object({
        name: z.string().optional(),
        columns: z.number().optional(),
      }),
    },
    reqData: {
      params: req.params,
      body: req.body,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.update(Content, validateResults);

  res.json(dbResult);
});

// Delete spesific Content with id
router.delete("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({ id: z.preprocess(Number, z.number()) }),
    },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbResult = await ac.remove(Content, validateResults);

  res.json(dbResult);
});

export { router as contentRouter };

// /**
//  * Archive Codes
//  */
// // // Get all contents - With filtering after the query - total manuplation!
// // router.get("/api/contents-wf/", async (req, res) => {
// //   await dsm
// //     .find(Content, {
// //       relations: {
// //         asset: true,
// //       },
// //     })
// //     .then((data) => {
// //       const filteredData = data.map((contents) => ({
// //         ...contents,
// //         asset: contents.asset.map((asset) => ({
// //           name: asset.name,
// //         })),
// //       }));
// //       res.json(filteredData);
// //     });
// // });

// // // Get all contents - with the querybuilder
// // router.get("/api/contents-wqb/", async (req, res) => {
// //   await dsm
// //     .createQueryBuilder(Content, "contents")
// //     .leftJoinAndSelect("contents.asset", "asset")
// //     .select(["contents.id", "contents.columns", "asset.name"])
// //     .getMany()
// //     .then((data) => res.json(data))
// //     .catch((e) => console.log(e));
// // });
