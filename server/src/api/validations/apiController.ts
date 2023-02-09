import {
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
} from "typeorm";
import { z } from "zod";
import { dsm } from "../../connections";

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
   * @param validateResults Output of inputValidate() function)
   * @returns Promise<Entity | null
   */
  export async function findOne<
    Entity extends ObjectLiteral,
    T extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    options: FindOneOptions<Entity>,
    validateResults: ValidateResults<T>,
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
  export async function find<Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    const dbResult = await dsm.find(entityClass, options).catch((e) => e);

    return dbResult;
  }
}
