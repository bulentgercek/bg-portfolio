import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import fs from "fs";
import path from "path";

import env from "../../validEnv";
import { ApiController as ac } from "../../apiController";
import { Asset, AssetType } from "../../entities/Asset";
import { Content } from "../../entities/Content";
import { filterObject } from "../../utils";
import { consoleRouteError } from "../../errorHandler";
import { multerUpload } from "../../multer";

const router = Router();

// Get Assets
router.get("/", async (req, res, next) => {
  try {
    const dbAssets = await ac.findAll(Asset, {
      select: {
        contents: {
          id: true,
          name: true,
        },
      },
      relations: {
        contents: true,
      },
    });

    res.json(dbAssets);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Get Asset
router.get("/:id", async (req, res, next) => {
  try {
    const ctxObj = ac.initContext({
      zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
      reqData: { params: req.params },
    });

    const validateResults = await ac.inputValidate(ctxObj);
    const dbAsset = await ac.findOne(Asset, validateResults, {
      select: {
        contents: {
          id: true,
          name: true,
        },
      },
      relations: {
        contents: true,
      },
    });

    res.json(dbAsset);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Add Asset
router.post("/", multerUpload.single("url"), async (req, res, next) => {
  try {
    const ctxObj = ac.initContext({
      zInput: {
        body: z.object({
          name: z.string().optional(),
          type: z.nativeEnum(AssetType).optional(),
          text: z.string().optional(),
          url: z.string().url().optional(),
          contents: z.array(z.number()).optional(),
        }),
      },
      reqData: { body: req.body, file: req.file },
    });

    const validateResults = await ac.inputValidate(ctxObj);

    // Guard Clause for filtering Body
    if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

    // Filter out the relational inputs before updating dbContent
    const filteredBody: Partial<Asset> = filterObject(validateResults.result.body, "contents");

    // Create new Asset
    const createdAsset = ac.create(Asset, filteredBody);

    // Upload File
    if (req.file) {
      // If image already exist don't add to db
      const uploadsDirectory = path.join(env.UPLOADS_BASE_PATH, "uploads");
      const targetFilePath = path.join(uploadsDirectory, req.file.originalname);

      if (fs.existsSync(targetFilePath)) {
        return res.status(200).json({ message: "A file with the same name already exists. File updated." });
      }

      try {
        // Process the uploaded image file and update the file if it has a name
        const uploadedImageUrl = await ac.processUploadedImage(req.file);
        // Update the 'url' property of the Asset entity with the final image URL
        createdAsset.url = uploadedImageUrl;
        validateResults.success.file = true;
      } catch (error) {
        console.log("An error is occured while processing the image:", error);
        return res.status(500).json({ message: "An error occured while processing the uploaded image." });
      }
    }

    // Get Content
    if (validateResults.result.body.contents) {
      const dbCategories = await ac.findAll(Content, {
        where: {
          id: In(validateResults.result.body.contents),
        },
      });

      // is validated?
      if (Array.isArray(dbCategories.dbData)) {
        createdAsset.contents = dbCategories.dbData;
      }
    }
    const savedAsset = await ac.addCreated(Asset, validateResults, createdAsset);
    res.json(savedAsset);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Update Asset
router.put("/:id", async (req, res, next) => {
  try {
    const ctxObj = ac.initContext({
      zInput: {
        params: z.object({ id: z.preprocess(Number, z.number()) }),
        body: z.object({
          name: z.string().optional(),
          type: z.nativeEnum(AssetType).optional(),
          url: z.string().url().optional(),
          text: z.string().optional(),
          contents: z.array(z.number()).optional(),
        }),
      },
      reqData: { params: req.params, body: req.body },
    });

    const validateResults = await ac.inputValidate(ctxObj);

    // Get Asset
    const dbAsset = await ac.findOne(Asset, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        contents: true,
      },
    });

    // Guard clause for Asset
    if (!(dbAsset.dbData instanceof Asset)) return res.status(400).json(dbAsset);

    // Guard clause for filtering Body
    if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

    // Filter out the relational inputs before create updatedAsset
    const filteredBody: Partial<Asset> = filterObject(validateResults.result.body, "contents");

    // Update values of dbAsset with filteredBody
    const updatedAsset: Asset = {
      ...dbAsset.dbData,
      ...filteredBody,
    };

    // Add Contents
    if (validateResults.result.body.contents) {
      const dbContents = await ac.findAll(Content, {
        where: {
          id: In(validateResults.result.body.contents),
        },
      });

      // is validated?
      if (Array.isArray(dbContents.dbData)) updatedAsset.contents = dbContents.dbData;
    }

    const finalUpdatedAsset = await ac.updateWithTarget(Asset, validateResults, updatedAsset);
    res.json(finalUpdatedAsset);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Remove Asset
router.delete("/:id", async (req, res, next) => {
  try {
    const ctxObj = ac.initContext({
      zInput: {
        params: z.object({
          id: z.preprocess(Number, z.number()),
        }),
      },
      reqData: { params: req.params },
    });

    const validateResults = await ac.inputValidate(ctxObj);
    const dbAsset = await ac.findOne(Asset, validateResults);

    if (dbAsset.dbData instanceof Asset) {
      // Delete the asset file if it exists and has the same domain name as our server
      await ac.deleteAssetFile(dbAsset.dbData.url);
    }

    const removedAsset = await ac.remove(Asset, validateResults);
    res.json(removedAsset);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

export { router as assetRouter };
