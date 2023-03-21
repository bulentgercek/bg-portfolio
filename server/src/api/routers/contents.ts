import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Asset } from "../../entities/Asset";
import { Content } from "../../entities/Content";

const router = Router();

// Get all contents
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbContents = await ac
    .findAll(Content, validateResults, {
      select: {
        item: {
          id: true,
        },
      },
      relations: {
        item: true,
        assets: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbContents);
});

// Get spesific content with id
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbContent = await ac
    .findOne(Content, validateResults, {
      relations: {
        assets: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbContent);
});

// Update spesific content with id
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
  const updatedContent = await ac
    .update(Content, validateResults)
    .catch((err) => console.log(err));

  res.json(updatedContent);
});

// Assign an asset to content with ids
router.put("/:id/assets/:aid", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
        aid: z.preprocess(Number, z.number()),
      }),
    },
    reqData: {
      params: req.params,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbContent = await ac
    .findOne(Content, validateResults, {
      relations: {
        assets: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbContent instanceof Content)) return res.json(dbContent);

  const dbAsset = await ac
    .findOne(Asset, validateResults, {
      where: {
        id: validateResults.result.params?.aid,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbAsset instanceof Asset)) return res.json(dbAsset);

  dbContent.assets = [...dbContent.assets, dbAsset];

  const updatedContent = await ac
    .updateWithTarget(Content, validateResults, dbContent)
    .catch((err) => console.log(err));

  res.json(updatedContent);
});

// Remove an asset from content with ids (Without deleting the asset from the db)
router.delete("/:id/assets/:aid", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
        aid: z.preprocess(Number, z.number()),
      }),
    },
    reqData: {
      params: req.params,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbContent = await ac
    .findOne(Content, validateResults, {
      relations: {
        assets: true,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbContent instanceof Content)) return res.json(dbContent);

  const dbAsset = await ac
    .findOne(Asset, validateResults, {
      where: {
        id: validateResults.result.params?.aid,
      },
    })
    .catch((err) => console.log(err));

  if (!(dbAsset instanceof Asset)) return res.json(dbAsset);

  dbContent.assets = dbContent.assets.filter(
    (asset) => asset.id !== dbAsset.id,
  );

  const updatedContent = await ac
    .updateWithTarget(Content, validateResults, dbContent)
    .catch((err) => console.log(err));

  res.json(updatedContent);
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
  const removedContent = await ac
    .remove(Content, validateResults)
    .catch((err) => console.log(err));

  res.json(removedContent);
});

export { router as contentRouter };

// // /**
// //  * Archive Codes
// //  */
// // // // Get all contents - With filtering after the query - total manuplation!
// // // router.get("/api/contents-wf/", async (req, res) => {
// // //   await dsm
// // //     .find(Content, {
// // //       relations: {
// // //         asset: true,
// // //       },
// // //     })
// // //     .then((data) => {
// // //       const filteredData = data.map((contents) => ({
// // //         ...contents,
// // //         asset: contents.asset.map((asset) => ({
// // //           name: asset.name,
// // //         })),
// // //       }));
// // //       res.json(filteredData);
// // //     });
// // // });

// // // // Get all contents - with the querybuilder
// // // router.get("/api/contents-wqb/", async (req, res) => {
// // //   await dsm
// // //     .createQueryBuilder(Content, "contents")
// // //     .leftJoinAndSelect("contents.asset", "asset")
// // //     .select(["contents.id", "contents.columns", "asset.name"])
// // //     .getMany()
// // //     .then((data) => res.json(data))
// // //     .catch((e) => console.log(e));
// // // });
