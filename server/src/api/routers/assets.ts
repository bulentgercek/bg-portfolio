import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";

import { ApiController as ac } from "../../apiController";
import { Asset, AssetType } from "../../entities/Asset";
import { Content } from "../../entities/Content";
import { filterObject } from "../../utils";
import { consoleRouteError, DatabaseError } from "../../errorHandler";
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
    const validateResults = await ac.inputValidate({
      zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
      reqData: { params: req.params },
    });

    const dbAsset = await ac.findOne(Asset, {
      where: {
        id: validateResults.result.params?.id,
      },
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
    const validateResults = await ac.inputValidate({
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

    // Filter out the relational inputs before updating dbContent
    const filteredBody: Partial<Asset> = filterObject(validateResults.result.body, "contents");

    // Create new Asset
    const createdAsset = ac.create(Asset, filteredBody);

    // Change the type if the url one of the supported types
    if (filteredBody.url) {
      createdAsset.type = (await ac.getAssetTypeFromFile(filteredBody.url)) ?? createdAsset.type;
    }

    // Upload File
    if (req.file) {
      try {
        // Process the uploaded image file and update the file if it has a name
        const uploadedFileUrl = await ac.processUploadedFile(req.file);
        // Update the 'url' property of the Asset entity with the final image URL
        createdAsset.url = uploadedFileUrl;
        createdAsset.name = createdAsset.name || req.file.originalname.replace(/\s+/g, "_");
        createdAsset.type = (await ac.getAssetTypeFromFile(uploadedFileUrl)) ?? createdAsset.type;
        validateResults.success.file = true;
      } catch (error) {
        console.error("An error is occured while processing the image:", error);
        throw Error("An error occured while processing the uploaded image.");
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
      if (Array.isArray(dbCategories)) {
        createdAsset.contents = dbCategories;
      }
    }

    const savedAsset = await ac.addCreated(Asset, createdAsset);
    res.json(savedAsset);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Update Asset
router.put("/:id", multerUpload.single("url"), async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: {
        params: z.object({ id: z.preprocess(Number, z.number()) }),
        body: z.object({
          name: z.string().optional(),
          type: z.nativeEnum(AssetType).optional(),
          url: z.string().url().nullable().optional(),
          text: z.string().optional(),
          contents: z.array(z.number()).optional(),
        }),
      },
      reqData: { params: req.params, body: req.body, file: req.file },
    });

    // Get Asset
    const dbAsset = await ac.findOne(Asset, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        contents: true,
      },
    });

    // Guard clause for Asset
    if (!dbAsset) throw new DatabaseError(`Asset not found: ${validateResults.result.params?.id}`);

    // Filter out the relational inputs before create updatedAsset
    const filteredBody: Partial<Asset> = filterObject(validateResults.result.body, "contents");

    // Update values of dbAsset with filteredBody
    const updatedAsset: Asset = {
      ...dbAsset,
      ...filteredBody,
    };

    if (updatedAsset.url) {
      // Delete the current image file if it's in server
      // Because foreign file url defined
      await ac.deleteFile(dbAsset.url);
      // Change the type if the url one of the supported types
      updatedAsset.type = (await ac.getAssetTypeFromFile(updatedAsset.url)) ?? updatedAsset.type;
    }

    // Upload File
    if (req.file) {
      // Delete the previous file if it's in server
      await ac.deleteFile(updatedAsset.url);
      // Process the uploaded file and update the file if it has a name
      const uploadedFileUrl = await ac.processUploadedFile(req.file);
      // Update the 'url' property of the Asset entity with the final image URL
      updatedAsset.url = uploadedFileUrl;
      updatedAsset.type = (await ac.getAssetTypeFromFile(uploadedFileUrl)) ?? updatedAsset.type;
      validateResults.success.file = true;
    }

    // Add Contents
    if (validateResults.result.body.contents) {
      const dbContents = await ac.findAll(Content, {
        where: {
          id: In(validateResults.result.body.contents),
        },
      });

      updatedAsset.contents = dbContents;
    }

    const finalUpdatedAsset = await ac.updateWithTarget(Asset, updatedAsset);
    res.json(finalUpdatedAsset);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Remove Asset
router.delete("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: {
        params: z.object({
          id: z.preprocess(Number, z.number()),
        }),
      },
      reqData: { params: req.params },
    });

    const dbAsset = await ac.findOne(Asset, {
      where: {
        id: validateResults.result.params?.id,
      },
    });

    if (!dbAsset) throw new DatabaseError(`Asset not found: ${validateResults.result.params?.id}`);

    const removedAsset = await ac.remove(Asset, validateResults);
    await ac.deleteFile(dbAsset.url);
    res.json(removedAsset);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

export { router as assetRouter };
