import { EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";
import { z } from "zod";
import { dsm } from "../../connections";

export default class ApiResults {
  async validate<TZodType extends z.ZodTypeAny, TReq>(
    zodSchema: TZodType,
    request: TReq,
  ) {
    type TZodSchema = z.infer<typeof zodSchema>;
    const validated: TZodSchema = await zodSchema.safeParseAsync(request);
    type Output = {
      validateSuccess: boolean;
      validateResults?: z.TypeOf<TZodType>;
    };
    const output: Output = {
      validateSuccess: validated.success,
      validateResults: validated.data,
    };
    return Promise.resolve(output);
  }

  async find<TZodType extends z.ZodTypeAny, Entity extends ObjectLiteral>(
    validateOutput: {
      validateSuccess: boolean;
      validateResults?: z.TypeOf<TZodType>;
    },
    entityClass: EntityTarget<Entity>,
    options?: FindManyOptions<Entity>,
  ) {
    type Output = {
      querySuccess: boolean;
      queryResults?: Entity[];
    };
    if (!validateOutput.validateSuccess) {
      return Promise.resolve({
        validateSuccess: false,
        querySuccess: false,
      });
    }

    const findOutput: Output = await dsm
      .find(entityClass, options)
      .then((result) => ({
        querySuccess: true,
        queryResults: result,
      }))
      .catch(() => ({
        querySuccess: false,
      }));

    type FinalOutput = typeof validateOutput & Output;
    const finalOutput: FinalOutput = {
      validateSuccess: validateOutput.validateSuccess,
      validateResults: validateOutput.validateResults,
      querySuccess: findOutput.querySuccess,
      queryResults: findOutput.queryResults,
    };
    return Promise.resolve(finalOutput);
  }
}
