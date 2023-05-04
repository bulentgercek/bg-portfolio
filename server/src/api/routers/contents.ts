import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Asset } from "../../entities/Asset";
import { Content, ContentType } from "../../entities/Content";
import { Item } from "../../entities/Item";
import { consoleRouteError, DatabaseError } from "../../errorHandler";
import { filterObject } from "../../utils";

const router = Router();

// Get Contents
router.get("/", async (req, res, next) => {
  try {
    const dbContents = await ac.findAll(Content, {
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

    res.json(dbContents);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Get Content
router.get("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
      reqData: { params: req.params },
    });

    const dbContent = await ac.findOne(Content, {
      where: {
        id: validateResults.result.params?.id,
      },
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

    res.json(dbContent);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Add Content
router.post("/", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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

    const dbItem = await ac.findOne(Item, {
      where: {
        id: validateResults.result.body?.item,
      },
    });

    // Filter out the relational inputs before updating dbContent
    const filteredBody = filterObject(validateResults.result.body, "item", "assets");

    const createdContent = ac.create(Content, filteredBody);

    // Add Item to Created Content
    createdContent.item = dbItem;

    // Add Assets to Created Content
    if (validateResults.result.body.assets) {
      const dbAssets = await ac.findAll(Asset, {
        where: {
          id: In(validateResults.result.body.assets),
        },
      });

      createdContent.assets = dbAssets;
    }

    const savedContent = await ac.addCreated(Content, createdContent);
    res.json(savedContent);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Update Content
router.put("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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

    // Get Content
    const dbContent = await ac.findOne(Content, {
      where: {
        id: validateResults.result.params?.id,
      },
      select: {
        item: {
          id: true,
          name: true,
        },
      },
      relations: { item: true, assets: true },
    });

    // Filter out the relational inputs before updating dbContent
    const filteredBody: Partial<Content> = filterObject(validateResults.result.body, "item", "assets");

    // Update values of dbContent with filteredBody by creating new Content
    const updatedContent: Content = { ...dbContent, ...filteredBody };

    // Get Item
    if (validateResults.result.body.item) {
      const dbItem = await ac.findOne(Item, {
        where: {
          id: validateResults.result.body?.item,
        },
      });

      updatedContent.item = dbItem;
    }

    // Get Assets
    if (validateResults.result.body.assets) {
      const dbAssets = await ac.findAll(Asset, {
        where: {
          id: In(validateResults.result.body.assets),
        },
      });

      updatedContent.assets = dbAssets;
    }

    const finalUpdatedContent = await ac.updateWithTarget(Content, updatedContent);
    res.json(finalUpdatedContent);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Assign Asset to Content
router.put("/:id/assets/:aid", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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

    // Get Content
    const dbContent = await ac.findOne(Content, {
      where: {
        id: validateResults.result.params?.id,
      },
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

    const isAssetExist = dbContent.assets.findIndex((asset) => asset.id === validateResults.result.params?.aid);

    // Then throw error message
    if (isAssetExist !== -1) {
      const errorMessage = `Content ${validateResults.result.params?.id} already has Asset with id ${validateResults.result.params?.aid}.`;
      console.error(errorMessage);
      throw new DatabaseError(errorMessage);
    }

    // Get Asset
    const dbAsset = await ac.findOne(Asset, {
      where: {
        id: validateResults.result.params?.aid,
      },
    });

    dbContent.assets = [...dbContent.assets, dbAsset];

    const updatedContent = await ac.updateWithTarget(Content, dbContent);

    res.json(updatedContent);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Remove Asset from Content
// This endpoint will remove the spesific Asset with id from Content without
// deleting it from the database.
router.delete("/:id/assets/:aid", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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
    const dbContent = await ac.findOne(Content, {
      where: {
        id: validateResults.result.params?.id,
      },
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

    const dbAsset = await ac.findOne(Asset, {
      where: {
        id: validateResults.result.params?.aid,
      },
    });

    const dbAssetId = dbAsset.id;
    dbContent.assets = dbContent.assets.filter((asset) => asset.id !== dbAssetId);
    const updatedContent = await ac.updateWithTarget(Content, dbContent);
    res.json(updatedContent);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Remove Content
router.delete("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: {
        params: z.object({ id: z.preprocess(Number, z.number()) }),
      },
      reqData: { params: req.params },
    });

    const removedContent = await ac.remove(Content, validateResults);
    res.json(removedContent);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

export { router as contentRouter };

// // /**
// //  * Archive Codes
// //  */
// // // // Get all contents - With filtering after the query - total manuplation!
// // // router.get("/api/contents-wf/", async (req, res, next) => {
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
// // // router.get("/api/contents-wqb/", async (req, res, next) => {
// // //   await dsm
// // //     .createQueryBuilder(Content, "contents")
// // //     .leftJoinAndSelect("contents.asset", "asset")
// // //     .select(["contents.id", "contents.columns", "asset.name"])
// // //     .getMany()
// // //     .then((data) => res.json(data))
// // //     .catch((e) => console.log(e));
// // // });
