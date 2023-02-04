import { z } from "zod";

export default function validate<zodObject extends z.AnyZodObject, requestData>(
  zodSchema: zodObject,
  request: requestData,
) {
  return zodSchema.safeParseAsync(request);
}
