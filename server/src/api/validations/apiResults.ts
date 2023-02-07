import { EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";
import { z, ZodSchema } from "zod";
import { dsm } from "../../connections";

type Results = {
  validateSuccess: Boolean;
  validateResults?: any;
  querySuccess?: Boolean;
  queryResults?: Array<ObjectLiteral>;
};

export default class ApiResults {
  results: Results;

  constructor() {
    this.results = {
      validateSuccess: true,
      validateResults: {},
      querySuccess: false,
      queryResults: [],
    };
  }

  async validate<zodObject extends z.AnyZodObject, requestData>(
    zodSchema: zodObject,
    request: requestData,
  ): Promise<this> {
    type IZodSchema = z.infer<ZodSchema>;

    await zodSchema
      .parseAsync(request)
      .then((result: {}) => {
        const iZodSchema: IZodSchema = result as IZodSchema;
        this.results.validateResults = iZodSchema;
        // console.log(this.results.validateResults.id);
      })
      .catch(() => {
        this.results.validateSuccess = false;
      });
    return Promise.resolve(this);
  }

  async find<Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    options?: FindManyOptions<Entity>,
  ): Promise<this> {
    if (!this.results.validateSuccess) {
      return Promise.resolve(this);
    }

    const data = await dsm
      .find(entityClass, options)
      .then((result) => {
        this.results.querySuccess = true;
        this.results.queryResults = result;
      })
      .catch(() => {
        this.results.querySuccess = false;
      });

    return Promise.resolve(this);
  }
}
