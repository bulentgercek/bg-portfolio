import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Option, OptionCategory, OptionType } from "../../entities/Option";

const router = Router();

// Get all Options
router.get("/", async (req, res, next) => {
  const dbOptions = await ac.findAll(Option);

  res.json(dbOptions);
});

// Get spesific Option with id
router.get("/:id", async (req, res, next) => {
  const ctxObj = ac.initContext({
    zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const dbOption = await ac.findOne(Option, validateResults);

  res.json(dbOption);
});

// Add an Option
router.post("/", async (req, res, next) => {
  const ctxObj = ac.initContext({
    zInput: {
      body: z.object({
        name: z.string().optional(),
        category: z.nativeEnum(OptionCategory).optional(),
        type: z.nativeEnum(OptionType).optional(),
        value: z.string().optional(),
        relation: z.number().optional(),
      }),
    },
    reqData: { body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const addedOption = await ac.addWithCreate(Option, validateResults);

  res.json(addedOption);
});

// Update the Option with id
router.put("/:id", async (req, res, next) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({ id: z.preprocess(Number, z.number()) }),
      body: z.object({
        name: z.string().optional(),
        category: z.nativeEnum(OptionCategory).optional(),
        type: z.nativeEnum(OptionType).optional(),
        value: z.string().optional(),
        relation: z.number().optional(),
      }),
    },
    reqData: { params: req.params, body: req.body },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const updatedOption = await ac.update(Option, validateResults);

  res.json(updatedOption);
});

// Remove an Option with id
router.delete("/:id", async (req, res, next) => {
  const ctxObj = ac.initContext({
    zInput: {
      params: z.object({
        id: z.preprocess(Number, z.number()),
      }),
    },
    reqData: { params: req.params },
  });

  const validateResults = await ac.inputValidate(ctxObj);
  const removedOption = await ac.remove(Option, validateResults);

  res.json(removedOption);
});

export { router as optionRouter };
