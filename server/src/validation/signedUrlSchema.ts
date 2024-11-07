import { z } from "zod";

export const signedURLSchema = z.object({
  size: z.coerce.number(),
  type: z.string(),
  checksum: z.string(),
});
