import { Router } from "express";
import { In } from "typeorm";
import { z } from "zod";
import multer from "multer";
import path from "path";

import { ApiController as ac, processUploadedImage } from "../../apiController";
import { Asset, AssetType } from "../../entities/Asset";
import { Content } from "../../entities/Content";
import { filterObject } from "../../utils";

const router = Router();

/**
 * Multer + Upload Setup
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(process.env.UPLOADS_BASE_PATH || "/var/www/bulentgercek.com/", "uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get Assets
router.get("/", async (req, res) => {
  const validateResults = await ac.inputValidate();
  const dbAssets = await ac
    .findAll(Asset, validateResults, {
      select: {
        contents: {
          id: true,
          name: true,
        },
      },
      relations: {
        contents: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbAssets);
});

// Get Asset
router.get("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbAsset = await ac
    .findOne(Asset, validateResults, {
      select: {
        contents: {
          id: true,
          name: true,
        },
      },
      relations: {
        contents: true,
      },
    })
    .catch((err) => console.log(err));

  res.json(dbAsset);
});

// Add Asset
router.post("/", upload.single("url"), async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string().optional(),
        type: z.nativeEnum(AssetType).optional(),
        text: z.string().optional(),
        url: z
          .string()
          .url()
          .optional()
          .or(
            z.object({
              url: z.string().optional(),
              imageFile: z.any(),
            }),
          ),
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

  // Upload Image: If file given then upload image file and update url
  if (req.file) {
    // Process the uploaded image file
    const uploadedImageUrl = await processUploadedImage(req.file);
    // Update the 'url' property of the Asset entity with the final image URL
    createdAsset.url = uploadedImageUrl;
  }

  // Get Content
  if (validateResults.result.body.contents) {
    const dbCategories = await ac.findAll(Content, validateResults, {
      where: {
        id: In(validateResults.result.body.contents),
      },
    });

    // is validated?
    if (Array.isArray(dbCategories)) {
      createdAsset.contents = dbCategories;
    }
  }

  const savedAsset = await ac.addCreated(Asset, validateResults, createdAsset).catch((err) => console.log(err));

  res.json(savedAsset);
});

// Update Asset
router.put("/:id", async (req, res) => {
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
  const dbAsset = await ac
    .findOne(Asset, validateResults, {
      where: {
        id: validateResults.result.params?.id,
      },
      relations: {
        contents: true,
      },
    })
    .catch((err) => console.log(err));

  // Guard clause for Asset
  if (!(dbAsset instanceof Asset)) return res.status(400).json(validateResults);

  // Guard clause for filtering Body
  if (!validateResults.success.body || !validateResults.result.body) return res.status(400).json(validateResults);

  // Filter out the relational inputs before create updatedAsset
  const filteredBody: Partial<Asset> = filterObject(validateResults.result.body, "contents");

  // Update values of dbAsset with filteredBody
  const updatedAsset: Asset = {
    ...dbAsset,
    ...filteredBody,
  };

  // Add Contents
  if (validateResults.result.body.contents) {
    const dbContents = await ac.findAll(Content, validateResults, {
      where: {
        id: In(validateResults.result.body.contents),
      },
    });

    // is validated?
    if (Array.isArray(dbContents)) updatedAsset.contents = dbContents;
  }

  const finalUpdatedAsset = await ac
    .updateWithTarget(Asset, validateResults, updatedAsset)
    .catch((err) => console.log(err));

  res.json(finalUpdatedAsset);
});

// Remove Asset
router.delete("/:id", async (req, res) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
    },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const removedAsset = await ac.remove(Asset, validateResults).catch((err) => console.log(err));

  res.json(removedAsset);
});

export { router as assetRouter };
