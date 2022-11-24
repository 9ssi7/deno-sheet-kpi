import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { sendJsonResponse } from "../../utils/router-context.ts";
import { useMetricService } from "./metric.service.ts";

export const registerMetricRoutes = (router: Router) => {
  const metricService = useMetricService();

  router.get("/metrics", async (ctx) => {
    const params = new URL(ctx.request.url).searchParams;
    sendJsonResponse(ctx, await metricService.handleMetric(params.get("id")!));
  });
};
