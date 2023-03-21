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
  export type ValidateResults<
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
   * @returns Promise<ValidateResults<TParams, TBody>>
   */
  export async function inputValidate<
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(ctxObj?: CtxObj<TParams, TBody>) {
    // Create success and result properties
    const validatedFinal: ValidateResults<TParams, TBody> = {
      success: {},
      result: {},
    };

    // if ctxObj not given so return true
    if (!ctxObj) {
      validatedFinal.success.params = true;
      validatedFinal.result.body = true;
      return Promise.resolve(validatedFinal);
    }

    // Check the input vs params and input vs body for throwing error
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

    // Create and
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

    // check if the 'validatedFinal' object is undefined
    if (validatedFinal === undefined)
      console.log("We have some undefined problem in validatedFinal");

    return Promise.resolve(validatedFinal);
  }

  /**
   * Caller for TypeORM Manager create functions
   * @param entityClass TypeORM Entity
   * @param plainObject Plain Object to be an Entity
   * @returns Entity
   */
  export function create<Entity>(
    entityClass: EntityTarget<Entity>,
    plainObject?: DeepPartial<Entity>,
  ): Entity {
    return dsm.create(entityClass, plainObject);
  }

  /**
   * Async Caller for TypeORM Manager find function
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options TypeORM Options (FindManyOptions)
   * @returns Promise<ValidateResults<TParams, TBody> | Entity[]
   */
  export async function findAll<
    Entity extends ObjectLiteral,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: FindManyOptions<Entity>,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    const dbResult = await dsm.find(entityClass, options);

    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager findOne function
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options TypeORM Options (FindOneOptions)
   * @returns Promise<Entity | ValidateResults<TParams, TBody> | null>
   */
  export async function findOne<
    Entity extends ObjectLiteral,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    options?: FindOneOptions<Entity>,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    // Add id from validated results to the find options if there is no where
    if (!options?.where) {
      options = Object.assign({}, options, {
        where: {
          id: validateResults.result.params?.id,
        },
      });
    }

    const dbResult: Promise<Entity | null> = await dsm
      .findOne(entityClass, options)
      .catch((e) => e);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Save functions
   * And Use them together to Add to Database
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<Entity | ValidateResults<TParams, TBody>>
   */
  export async function addCreated<
    Entity,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    entity: Entity,
    options?: SaveOptions,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    const dbResult = dsm.save(entityClass, entity, options);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Create and Save functions
   * And Use them together to Add to Database
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<Entity | ValidateResults<TParams, TBody>>
   */
  export async function addWithCreate<
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
    const dbResult = dsm.save(entityClass, newItem, options);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Remove function
   * @param entity TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param options? TypeORM Options (RemoveOptions)
   * @returns Promise<Entity | ValidateResults<TParams, TBody> | undefined>
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
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<Entity | ValidateResults<TParams, TBody>>
   */
  export async function update<
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

    // Save needs id, so adding params to body
    const targetEntity: Entity = Object.assign(
      {},
      validateResults.result.params,
      validateResults.result.body,
    );

    const dbResult = dsm.save(entityClass, targetEntity, options);
    return dbResult;
  }

  /**
   * Async Caller for TypeORM Manager Save function to Update Relations
   * @param entityClass TypeORM Entity
   * @param validateResults Output of inputValidate() function
   * @param targetEntity: TypeORM Entity with Updated Relations,
   * @param options? TypeORM Options (SaveOptions)
   * @returns Promise<Entity | ValidateResults<TParams, TBody>>
   */
  export async function updateWithTarget<
    Entity,
    TParams extends z.ZodTypeAny,
    TBody extends z.ZodTypeAny,
  >(
    entityClass: EntityTarget<Entity>,
    validateResults: ValidateResults<TParams, TBody>,
    targetEntity: DeepPartial<Entity>,
    options?: SaveOptions,
  ) {
    if (
      validateResults.success.params === false ||
      validateResults.success.body === false
    )
      return validateResults;

    const dbResult = dsm.save(entityClass, targetEntity, options);
    return dbResult;
  }
}
