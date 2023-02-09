import { z } from "zod";

export async function validate<T extends z.ZodTypeAny>(
  input: T,
  request: Object,
): Promise<{
  validateSuccess: boolean;
  validateResults: z.TypeOf<T>;
}> {
  type InputType = z.infer<typeof input>;
  const validated: InputType = await input.safeParseAsync(request);

  return Promise.resolve({
    validateSuccess: validated.success,
    validateResults: validated.success ? validated.data : validated.error,
  });
}
