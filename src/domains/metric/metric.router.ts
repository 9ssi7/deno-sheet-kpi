import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { isMetric } from "./metric.types.ts";
import { sendJsonResponse } from "../../utils/router-context.ts";
import { useMetricService } from "./metric.service.ts";
import { useMetricValidator } from "./metric.validator.ts";

export const registerMetricRoutes = (router: Router) => {
  const metricService = useMetricService();
  const metricValidator = useMetricValidator();

  router.get("/metrics", async (ctx) => {
    const cached = await metricService.checkCache();
    if (!cached)
      return sendJsonResponse(
        ctx,
        {
          success: false,
          message: "Data is now caching. Please retry a few seconds later",
        },
        400
      );
    const params = new URL(ctx.request.url).searchParams;
    const metric = params.get("id");
    if (!isMetric(metric))
      return sendJsonResponse(
        ctx,
        { success: false, message: "Invalid metric" },
        400
      );
    const validation = metricValidator.filterByMetric(metric, params);
    if (!validation.success) return sendJsonResponse(ctx, validation, 400);
    sendJsonResponse(
      ctx,
      await metricService.handleMetric(metric, validation.result)
    );
  });
};
