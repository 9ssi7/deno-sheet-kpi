import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

export const createRouter = () => {
  const router = new Router();

  router.get("/", (ctx) => {
    throw new Error("This is an error");
  });

  return {
    routes: router.routes(),
    allowedMethods: router.allowedMethods(),
    port: 8000,
  };
};
