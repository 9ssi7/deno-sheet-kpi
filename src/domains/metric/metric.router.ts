import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { useMetricService } from "./metric.service.ts";

export const registerMetricRoutes = (router: Router) => {
  const metricService = useMetricService();
};
