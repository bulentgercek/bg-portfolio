import {
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  SaveOptions,
  RemoveOptions,
  DeepPartial,
} from "typeorm";
import { z } from "zod";
import { promises as fsPromises } from "fs";
import path from "path";

import env from "./validEnv";
import { dsm } from "./connections";
import { DatabaseError, ValidationError } from "./errorHandler";
import { AssetType } from "./entities/Asset";

export namespace ApiController {
  /**
   * AtLeastOne type ensures that at least one property from the input type T is present.
   * It combines a partially optional version of T with the union of T's properties.
   */
  export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

  /**
   * Context Object for Zod Input and Request Data (params or body)
   */
  type CtxObj<TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny> = {
    zInput: AtLeastOne<{ params: TParams; body: TBody }>;
    reqData: AtLeastOne<{ params: Object; body: Object; file?: Object }>;
  };

  /**
   * Output object for inputValidate function
   */
  export type ValidateResults<TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny> = {
    success: AtLeastOne<{ params: Boolean; body: Boolean; file?: boolean }>;
    result: { params: z.TypeOf<TParams>; body: z.TypeOf<TBody> };
    error?: { params?: z.ZodError; body?: z.ZodError };
  };

  /**
   * Async Validation function for Zod Input
   * @param ctxObj Context Object
   * @returns Promise<ValidateResults<TParams, TBody>>
   */
  export const inputValidate = async <TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny>(
    ctxObj: CtxObj<TParams, TBody>,
  ) => {
    // Define the Result type
    type Result = ValidateResults<TParams, TBody>["result"];

    // Initialize the success, result, and error objects
    const success: ValidateResults<TParams, TBody>["success"] = {};
    const result: Partial<Result> = {};
    const error: ValidateResults<TParams, TBody>["error"] = {};

    // If params are provided in the zInput object, validate them
    if (ctxObj.zInput.params) {
      // Define the InputType based on the provided params schema
      type InputType = z.infer<typeof ctxObj.zInput.params>;
      // Validate the input data using Zod's safeParseAsync method
      const validated: InputType = await ctxObj.zInput.params.safeParseAsync(ctxObj.reqData.params);
      // Update the success, result, and error objects based on the validation results
      success.params = validated.success;
      result.params = validated.success && validated.data;
      error.params = !validated.success && validated.error;
    }

    // If a body is provided in the zInput object, validate it
    if (ctxObj.zInput.body) {
      // Define the InputType based on the provided body schema
      type InputType = z.infer<typeof ctxObj.zInput.body>;
      // Validate the input data using Zod's safeParseAsync method
      const validated: InputType = await ctxObj.zInput.body.safeParseAsync(ctxObj.reqData.body);
      // Update the success, result, and error objects based on the validation results
      success.body = validated.success;
      result.body = validated.success && validated.data;
      error.body = !validated.success && validated.error;
    }

    // Create the final validated object with success, result, and error properties
    const validatedFinal: ValidateResults<TParams, TBody> = {
      success: success,
      result: result as Result,
      error: error,
    };

    // If there is any error in params or body, throw a ValidationError with the error details
    if (error.params || error.body) {
      throw new ValidationError("Input validation failed.", validatedFinal.error);
    }

    // If validation is successful, return the validated final object as a resolved Promise
    return Promise.resolve(validatedFinal);
  };

  /**
   * Caller for TypeORM Manager create functions
   * @param entityClass TypeORM Entity
   * @param plainObject Plain Object to be an Entity
   * @returns Entity
   */
  export const create = <Entity>(entityClass: EntityTarget<Entity>, plainObject?: DeepPartial<Entity>): Entity => {
    return dsm.create(entityClass, plainObject);
  };

  /**
   * Async Caller for TypeORM Manager find function
   * @param entityClass TypeORM Entity
   * @param options TypeORM Options (FindManyOptions)
   * @returns Promise<Entity[]>
   */
  export const findAll = async <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    options?: FindManyOptions<Entity>,
  ) => {
    try {
      const dbResult = await dsm.find(entityClass, options);
      return dbResult;
    } catch (error) {
      const errorMessage = `Error in findAll with: ${options}`;
      console.error(errorMessage);
      throw new DatabaseError(errorMessage);
    }
  };

  /**
   * Async Caller for TypeORM Manager findOne function
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options TypeORM Options (FindOneOptions)
   * @returns Promise<{
    validateResults: ValidateResults<TParams, TBody>;
    dbData: Entity;}>
   */
  export const findOne = async <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    options: FindOneOptions<Entity>,
  ) => {
    try {
      const dbResult = await dsm.findOne(entityClass, options);
      if (dbResult === null) throw Error;
      return dbResult;
    } catch (error) {
      const errorMessage = `Error in findOne with: ${options.where}`;
      console.error(errorMessage, error);
      throw new DatabaseError(errorMessage);
    }
  };

  /**
   * Async Caller for TypeORM Manager Save functions
   * And Use them together to Add to Database
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<{
    validateResults: ValidateResults<TParams, TBody>;
    dbData: Entity;}>
   */
  export const addCreated = async <Entity>(
    entityClass: EntityTarget<Entity>,
    entity: Entity,
    options?: SaveOptions,
  ) => {
    try {
      const dbResult = await dsm.save(entityClass, entity, options);
      return dbResult;
    } catch (error) {
      const errorMessage = `Error in addCreated with: ${entity}`;
      console.error(errorMessage, error);
      throw new DatabaseError(errorMessage);
    }
  };

  /**
   * Async Caller for TypeORM Manager Create and Save functions
   * And Use them together to Add to Database
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<Awaited<Entity> & Entity>
   */
  export const addWithCreate = async <Entity, TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny>(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: SaveOptions,
  ) => {
    try {
      const newItem = await dsm.create(entityClass, validateResults.result.body);
      const dbResult = await dsm.save(entityClass, newItem, options);
      return dbResult;
    } catch (error) {
      const errorMessage = `Error in addWithCreate for: ${validateResults.result.body}`;
      console.error(errorMessage, error);
      throw new DatabaseError(errorMessage);
    }
  };

  /**
   * Async Caller for TypeORM Manager Remove function
   * @param entity TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (RemoveOptions)
   * @returns Promise<Entity>
   */
  export const remove = async <Entity, TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny>(
    targetOrEntity: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: RemoveOptions,
  ) => {
    try {
      const dbResult = await dsm.remove(targetOrEntity, validateResults.result.params, options);
      return dbResult;
    } catch (error) {
      const errorMessage = `Error in remove with: ${validateResults.result.params}`;
      console.error(errorMessage, error);
      throw new DatabaseError(errorMessage);
    }
  };

  /**
   * Async Caller for TypeORM Manager Save function for Update Values
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<Entity>
   */
  export const update = async <Entity, TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny>(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: SaveOptions,
  ) => {
    // Save needs id, so adding params to body
    const targetEntity: Entity = Object.assign({}, validateResults.result.params, validateResults.result.body);

    try {
      const dbResult = await dsm.save(entityClass, targetEntity, options);
      return dbResult;
    } catch (error) {
      const errorMessage = `Error in update on: ${targetEntity}`;
      console.error(errorMessage, error);
      throw new DatabaseError(errorMessage);
    }
  };

  /**
   * Async Caller for TypeORM Manager Save function to Update Relations
   * @param entityClass TypeORM Entity
   * @param targetEntity: TypeORM Entity with Updated Relations,
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<T & Entity>
   */
  export const updateWithTarget = async <Entity>(
    entityClass: EntityTarget<Entity>,
    targetEntity: DeepPartial<Entity>,
    options?: SaveOptions,
  ) => {
    try {
      const dbResult = await dsm.save(entityClass, targetEntity, options);
      return dbResult;
    } catch (error) {
      const errorMessage = `Error in updateWithTarget on: ${targetEntity}`;
      console.error(errorMessage, error);
      throw new DatabaseError(errorMessage);
    }
  };

  /**
   * Process Uploaded Image
   * @param file Multer File
   * @returns string
   */
  export const processUploadedFile = async (file: Express.Multer.File): Promise<string> => {
    // Define new file path for uploaded file
    const uploadsDirectory = path.join(env.UPLOADS_BASE_PATH, "uploads");
    const uploadedFileName = file.filename;
    const multerFilePath = file.path;
    const newFilePath = path.join(uploadsDirectory, uploadedFileName);

    // Move file to new file path
    try {
      await fsPromises.rename(multerFilePath, newFilePath);
    } catch (error) {
      const errorMessage = `Error occured while moving the file to new file path: ${newFilePath}`;
      console.error(errorMessage, error);
      throw Error(errorMessage);
    }

    // Construct the final URL for the image
    const fileUrl = `${env.SERVER_URL}/uploads/${uploadedFileName}`;

    return fileUrl;
  };

  /**
   * Helper function to delete the file
   * @param fileUrl string
   */
  export const deleteFile = async (fileUrl: string) => {
    try {
      if (!fileUrl) return;

      const url = new URL(fileUrl);
      // Delete the asset file if it exists and has the same domain name as our server
      if (url.origin === env.SERVER_URL) {
        const filePath = path.join(env.UPLOADS_BASE_PATH, "uploads", path.basename(url.pathname || ""));

        await fsPromises.unlink(filePath);
      }
    } catch (error) {
      const errorMessage = `Failed to delete file: ${fileUrl}`;
      console.error(errorMessage, error);
      throw Error(errorMessage);
    }
  };

  /**
   * Checks the file if exist
   * @param file string
   * @returns boolean
   */
  export const isFileExist = async (file: Express.Multer.File) => {
    const uploadsDirectory = path.join(env.UPLOADS_BASE_PATH, "uploads");
    const targetFilePath = path.join(uploadsDirectory, file.originalname);

    try {
      await fsPromises.access(targetFilePath);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Get the AssetType from file extension
   * @param file string
   * @returns AssetType
   */
  export const getAssetTypeFromFile = async (fileUrl: string): Promise<AssetType | null> => {
    try {
      const url = new URL(fileUrl);
      const ext = path.extname(url.pathname);

      switch (ext) {
        case ".jpg":
        case ".png":
          return AssetType.Image;
        case ".txt":
          return AssetType.Text;
        case ".pdf":
          return AssetType.Pdf;
        default:
          return null;
      }
    } catch (error) {
      const errorMessage = `Failed to get AssetType: ${fileUrl}`;
      console.error(errorMessage, error);
      throw Error(errorMessage);
    }
  };
}
