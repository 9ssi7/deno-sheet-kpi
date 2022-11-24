import { AppVariables } from "./config/variables.enum.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getRequiredEnv } from "./config/env.ts";
import { registerMetricRoutes } from "./domains/metric/metric.router.ts";

export const createRouter = () => {
  const router = new Router();

  registerMetricRoutes(router);

  return {
    routes: router.routes(),
    allowedMethods: router.allowedMethods(),
    port: getRequiredEnv<number>(AppVariables.SERVER_PORT),
  };
};
