import {
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  SaveOptions,
  RemoveOptions,
} from "typeorm";
import { z } from "zod";
import { dsm } from "../connections";

export namespace ApiController {
  /**
   * Context Object for Zod Input and Request Data (params or body) Server
   */
  type CtxObj<T extends z.ZodTypeAny> = {
    zInput: T;
    reqData: Object;
  };

  /**
   * Output object for inputValidate function
   */
  type ValidateResults<T extends z.ZodTypeAny> = {
    success: Boolean;
    result: z.TypeOf<T>;
  };

  /**
   * Context Object Initializer
   * @param ctxObj Context Object
   * @returns CtxObj<T>
   */
  export function initContext<T extends z.ZodTypeAny>(ctxObj: CtxObj<T>) {
    return ctxObj;
  }

  /**
   * Async Validation function for Zod Input
   * @param ctxObj Context Object
   * @returns Promise<ValidateResults<T>>
   */
  export async function inputValidate<T extends z.ZodTypeAny>(
    ctxObj: CtxObj<T>,
  ): Promise<ValidateResults<T>> {
    type InputType = z.infer<typeof ctxObj.zInput>;
    const validated: InputType = await ctxObj.zInput.safeParseAsync(
      ctxObj.reqData,
    );

    return Promise.resolve({
      success: validated.success,
      result: validated.success ? validated.data : validated.error,
    });
  }

  /**
   * Async Caller for TypeORM Manager findOne function
   * @param entityClass TypeORM Entity
   * @param options TypeORM Options (relations etc.)
   * @param validateResults Output of inputValidate() function
   * @returns Promise<Entity | null
   */
  export async function findOne<
    Entity extends ObjectLiteral,
    T extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<T>,
    options: FindOneOptions<Entity>,
  ): Promise<ValidateResults<T> | Entity | null> {
    if (!validateResults.success) return validateResults;

    const dbResult = await dsm.findOne(entityClass, options).catch((e) => e);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager find function
   * @param entityClass TypeORM Entity
   * @param options TypeORM Options (relations etc.)
   * @returns Promise<Entity[]>
   */
  export async function findAll<Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    const dbResult = await dsm.find(entityClass, options).catch((e) => e);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Create and Save functions
   * And Use them together to Add to Database
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @returns Promise<Entity | Entity[] | ValidateResults<T>>
   */
  export async function add<Entity, T extends z.ZodTypeAny>(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<T>,
    options?: SaveOptions,
  ): Promise<Entity | Entity[] | ValidateResults<T>> {
    if (!validateResults.success) return validateResults;

    const newItem = dsm.create(entityClass, validateResults.result);
    const dbResult = dsm.save(newItem, options);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Remove function
   * @param entity TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (relations etc.)
   * @returns Promise<Entity | Entity[] | ValidateResults<T>>
   */
  export async function remove<Entity, T extends z.ZodTypeAny>(
    targetOrEntity: EntityTarget<Entity>,
    validateResults: ValidateResults<T>,
    options?: RemoveOptions,
  ): Promise<Entity | Entity[] | ValidateResults<T>> {
    if (!validateResults.success) return validateResults;

    const dbResult = dsm.remove(
      targetOrEntity,
      validateResults.result,
      options,
    );

    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Save function for Update Values
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (relations etc.)
   * @returns Promise<Entity | Entity[] | ValidateResults<T>>
   */
  export async function update<Entity, T extends z.ZodTypeAny>(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<T>,
    options?: SaveOptions,
  ): Promise<Entity | Entity[] | ValidateResults<T>> {
    if (!validateResults.success) return validateResults;

    const dbResult = dsm.save(entityClass, validateResults.result, options);
    return dbResult;
  }
}
