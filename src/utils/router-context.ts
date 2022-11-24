import type { Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import type { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { failure } from "./response.ts";

export const sendJsonResponse = <B = any>(
  ctx: RouterContext<any, any, any> | Context,
  body: B,
  status = 200
) => {
  ctx.response.status = status;
  ctx.response.body =
    typeof body === "string" ? body : JSON.stringify(body, null, 2);
  ctx.response.type = "application/json";
};

export const sendBadRequest = (
  ctx: RouterContext<any, any, any> | Context,
  msg: string
) => {
  sendJsonResponse(ctx, failure(msg), 400);
};
