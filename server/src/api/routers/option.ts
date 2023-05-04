import { Router } from "express";
import { z } from "zod";
import { ApiController as ac } from "../../apiController";
import { Option, OptionCategory, OptionType } from "../../entities/Option";
import { consoleRouteError } from "../../errorHandler";

const router = Router();

// Get all Options
router.get("/", async (req, res, next) => {
  try {
    const dbOptions = await ac.findAll(Option);

    res.json(dbOptions);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Get spesific Option with id
router.get("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
      zInput: { params: z.object({ id: z.preprocess(Number, z.number()) }) },
      reqData: { params: req.params },
    });
    const dbOption = await ac.findOne(Option, {
      where: {
        id: validateResults.result.params.id,
      },
    });

    res.json(dbOption);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Add an Option
router.post("/", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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
    const addedOption = await ac.addWithCreate(Option, validateResults);

    res.json(addedOption);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Update the Option with id
router.put("/:id", async (req, res, next) => {
  try {
    const validateResults = await ac.inputValidate({
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
    const updatedOption = await ac.update(Option, validateResults);

    res.json(updatedOption);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

// Remove an Option with id
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
    const removedOption = await ac.remove(Option, validateResults);

    res.json(removedOption);
  } catch (error) {
    consoleRouteError(error, req);
    next(error);
  }
});

export { router as optionRouter };
