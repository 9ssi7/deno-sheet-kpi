import type { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { sendJsonResponse } from "../utils/router-context.ts";

export const errorHandler = async (
  context: Context,
  next: () => Promise<unknown>
) => {
  try {
    await next();
  } catch (error) {
    sendJsonResponse(context, { success: false, message: error.message }, 500);
  }
};
