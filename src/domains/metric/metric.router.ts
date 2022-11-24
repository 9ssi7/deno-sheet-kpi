import {
  sendBadRequest,
  sendJsonResponse,
} from "../../utils/router-context.ts";

import { MetricMessages } from "./metric.messages.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { isMetric } from "./metric.types.ts";
import { useMetricService } from "./metric.service.ts";
import { useMetricValidator } from "./metric.validator.ts";

export const registerMetricRoutes = (router: Router) => {
  const metricService = useMetricService();
  const metricValidator = useMetricValidator();

  router.use(async (ctx, next) => {
    const cached = await metricService.checkCache();
    if (!cached) return sendBadRequest(ctx, MetricMessages.caching);
    return next();
  });

  router.get("/metrics", async (ctx) => {
    const params = new URL(ctx.request.url).searchParams;
    const metric = params.get("id");
    if (!isMetric(metric)) return sendBadRequest(ctx, MetricMessages.invalid);
    const validation = metricValidator.filterByMetric(metric, params);
    if (!validation.success) return sendJsonResponse(ctx, validation, 400);
    sendJsonResponse(
      ctx,
      await metricService.handleMetric(metric, validation.result)
    );
  });
};
