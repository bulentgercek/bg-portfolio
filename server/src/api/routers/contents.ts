import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Asset } from "../../entities/Asset";
import { Content, ContentType } from "../../entities/Content";
import { Item } from "../../entities/Item";
import { filterObject } from "../../utils";

const router = Router();

// Get Contents
router.get("/", async (req, res) => {
  const dbContents = await ac
    .findAll(Content, {
      select: {
        item: {
          id: true,
          name: true,
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

// Get Content
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbContent = await ac
    .findOne(Content, validateResults, {
      select: {
        item: {
          id: true,
          name: true,
        },
      },
      relations: {
        item: true,
        assets: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbContent);
});

// Add Content
router.post("/", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string().optional(),
        type: z.nativeEnum(ContentType).optional(),
        columns: z.number().optional(),
        item: z.number().optional(),
        assets: z.array(z.number()).optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  const dbItem = await ac.findOne(Item, validateResults, {
    where: {
      id: validateResults.result.body?.item,
    },
  });

  if (!(dbItem.dbData instanceof Item)) return res.status(400).json(validateResults);

  // Guard Clause for filtering Body
  if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

  // Filter out the relational inputs before updating dbContent
  const filteredBody = filterObject(validateResults.result.body, "item", "assets");

  const createdContent = ac.create(Content, filteredBody);

  // Add Item to Created Content
  createdContent.item = dbItem.dbData;

  // Add Assets to Created Content
  if (validateResults.result.body.assets) {
    const dbAssets = await ac.findAll(Asset, {
      where: {
        id: In(validateResults.result.body.assets),
      },
    });

    // is validated?
    if (Array.isArray(dbAssets.dbData)) {
      createdContent.assets = dbAssets.dbData;
    }
  }

  const savedContent = await ac.addCreated(Content, validateResults, createdContent);
  res.json(savedContent);
});

// Update Content
router.put("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
      body: z.object({
        name: z.string().optional(),
        type: z.nativeEnum(ContentType).optional(),
        columns: z.number().optional(),
        item: z.number().optional(),
        assets: z.array(z.number()).optional(),
      }),
    },
    reqData: {
      params: req.params,
      body: req.body,
    },
  });

  const validateResults = await ac.inputValidate(ctxObj);

  // Get Content
  const dbContent = await ac.findOne(Content, validateResults, {
    select: {
      item: {
        id: true,
        name: true,
      },
    },
    relations: { item: true, assets: true },
  });

  if (!(dbContent.dbData instanceof Content)) return res.status(400).json(validateResults);

  // Guard Clause for filtering Body
  if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

  // Filter out the relational inputs before updating dbContent
  const filteredBody: Partial<Content> = filterObject(validateResults.result.body, "item", "assets");

  // Update values of dbContent with filteredBody by creating new Content
  const updatedContent: Content = { ...dbContent.dbData, ...filteredBody };

  // Get Item
  if (validateResults.result.body.item) {
    const dbItem = await ac.findOne(Item, validateResults, {
      where: {
        id: validateResults.result.body?.item,
      },
    });

    if (dbItem.dbData instanceof Item) updatedContent.item = dbItem.dbData;
  }

  // Get Assets
  if (validateResults.result.body.assets) {
    const dbAssets = await ac.findAll(Asset, {
      where: {
        id: In(validateResults.result.body.assets),
      },
    });

    // is validated?
    if (Array.isArray(dbAssets.dbData)) updatedContent.assets = dbAssets.dbData;
  }

  const finalUpdatedContent = await ac.updateWithTarget(Content, validateResults, updatedContent);

  res.json(finalUpdatedContent);
});

// Assign Asset to Content
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

  // Get Content
  const dbContent = await ac.findOne(Content, validateResults, {
    select: {
      item: {
        id: true,
        name: true,
      },
    },
    relations: {
      item: true,
      assets: true,
    },
  });

  if (!(dbContent.dbData instanceof Content)) return res.status(400).json(validateResults);

  // Is Asset exist?
  const isAssetExist = dbContent.dbData.assets.findIndex((asset) => asset.id === validateResults.result.params?.aid);
  // Then throw error message
  if (isAssetExist !== -1)
    return res.status(400).json({
      message: `Content ${validateResults.result.params?.id} already has Asset with id ${validateResults.result.params?.aid}.`,
    });

  // Get Asset
  const dbAsset = await ac.findOne(Asset, validateResults, {
    where: {
      id: validateResults.result.params?.aid,
    },
  });

  if (!(dbAsset.dbData instanceof Asset)) return res.status(400).json(validateResults);

  dbContent.dbData.assets = [...dbContent.dbData.assets, dbAsset.dbData];

  const updatedContent = await ac
    .updateWithTarget(Content, validateResults, dbContent.dbData)
    .catch((err) => console.log(err));

  res.json(updatedContent);
});

// Remove Asset from Content
// This endpoint will remove the spesific Asset with id from Content without
// deleting it from the database.
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
  const dbContent = await ac.findOne(Content, validateResults, {
    select: {
      item: {
        id: true,
        name: true,
      },
    },
    relations: {
      item: true,
      assets: true,
    },
  });

  if (!(dbContent.dbData instanceof Content)) return res.status(400).json(validateResults);

  const dbAsset = await ac.findOne(Asset, validateResults, {
    where: {
      id: validateResults.result.params?.aid,
    },
  });

  if (!(dbAsset.dbData instanceof Asset)) return res.status(400).json(validateResults);
  const dbAssetId = dbAsset.dbData.id;
  dbContent.dbData.assets = dbContent.dbData.assets.filter((asset) => asset.id !== dbAssetId);
  const updatedContent = await ac.updateWithTarget(Content, validateResults, dbContent.dbData);
  res.json(updatedContent);
});

// Remove Content
router.delete("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({ id: z.preprocess(Number, z.number()) }),
    },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const removedContent = await ac.remove(Content, validateResults).catch((err) => console.log(err));

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
