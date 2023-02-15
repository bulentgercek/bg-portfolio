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
import { dsm } from "./connections";

export namespace ApiController {
  /**
   * Context Object for Zod Input and Request Data (params or body) Server
   */
  type CtxObj<TParams extends z.ZodTypeAny, TBody extends z.ZodTypeAny> = {
    zInput: { params?: TParams; body?: TBody };
    reqData: { params?: Object; body?: Object };
  };

  /**
   * Output object for inputValidate function
   */
  type ValidateResults<
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  > = {
    success: { params?: Boolean; body?: Boolean };
    result: { params?: z.TypeOf<TParams>; body?: z.TypeOf<TBody> };
  };

  /**
   * Context Object Initializer
   * @param ctxObj Context Object
   * @returns CtxObj<TParams, TBody>
   */
  export function initContext<
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(ctxObj: CtxObj<TParams, TBody>) {
    return ctxObj;
  }

  /**
   * Async Validation function for Zod Input
   * @param ctxObj Context Object
   * @returns Promise
   */
  export async function inputValidate<
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(ctxObj: CtxObj<TParams, TBody>) {
    const validatedFinal: ValidateResults<TParams, TBody> = {
      success: {},
      result: {},
    };
    if (ctxObj.zInput.params && !ctxObj.reqData.params) {
      console.error(
        "ERROR: Params defined for Zod but no params found in reqData. Check initContext definition.",
      );
      process.exit(1);
    }
    if (ctxObj.zInput.body && !ctxObj.reqData.body) {
      console.error(
        "ERROR: Body defined for Zod but no body found in reqData. Check initContext definition.",
      );
      process.exit(1);
    }
    if (ctxObj.zInput.params) {
      type InputType = z.infer<typeof ctxObj.zInput.params>;
      const validated: InputType = await ctxObj.zInput.params.safeParseAsync(
        ctxObj.reqData.params,
      );
      validatedFinal.success.params = validated.success;
      validatedFinal.result.params = validated.success
        ? validated.data
        : validated.error;
    }
    if (ctxObj.zInput.body) {
      type InputType = z.infer<typeof ctxObj.zInput.body>;
      const validated: InputType = await ctxObj.zInput.body.safeParseAsync(
        ctxObj.reqData.body,
      );
      validatedFinal.success.body = validated.success;
      validatedFinal.result.body = validated.success
        ? validated.data
        : validated.error;
    }
    return Promise.resolve(validatedFinal);
  }

  /**
   * Async Caller for TypeORM Manager find function
   * @param entityClass TypeORM Entity
   * @param options TypeORM Options (relations etc.)
   * @returns Promise
   */
  export async function findAll<Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    options?: FindManyOptions<Entity>,
  ) {
    const dbResult = await dsm.find(entityClass, options).catch((e) => e);

    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager findOne function
   * @param entityClass TypeORM Entity
   * @param options TypeORM Options (relations etc.)
   * @param validateResults Output of inputValidate() function
   * @returns Promise
   */
  export async function findOne<
    Entity extends ObjectLiteral,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options: FindOneOptions<Entity>,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    const dbResult = await dsm.findOne(entityClass, options).catch((e) => e);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Create and Save functions
   * And Use them together to Add to Database
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @returns Promise
   */
  export async function add<
    Entity,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: SaveOptions,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    const newItem = dsm.create(entityClass, validateResults.result.body);
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
  export async function remove<
    Entity,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    targetOrEntity: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: RemoveOptions,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    const dbResult = dsm.remove(
      targetOrEntity,
      validateResults.result.params,
      options,
    );

    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Save function for Update Values
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (relations etc.)
   * @returns Promise
   */
  export async function update<
    Entity,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    targetEntity?: DeepPartial<Entity>,
    options?: SaveOptions,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    const mergeResults = Object.assign(
      {},
      validateResults.result.params,
      validateResults.result.body,
    );

    if (!targetEntity) {
      const dbResult = dsm.save(entityClass, mergeResults, options);
      return dbResult;
    }

    const dbResult = dsm.save(entityClass, targetEntity, options);
    return dbResult;
  }

  export async function updateRelation<
    Entity,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: SaveOptions,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    // const dbResult = dsm.save(entityClass, relationEntity, options);
  }
}
