import { z } from "zod";

export default async function validate<
  zodObject extends z.AnyZodObject,
  requestData,
>(zodSchema: zodObject, request: requestData) {
  return zodSchema.safeParseAsync(request);
}
