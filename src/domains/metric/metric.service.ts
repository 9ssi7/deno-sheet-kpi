import { useCacheService } from "./metric.cache-service.ts";
import { useMetricRepository } from "./metric.repo.ts";

export const useMetricService = () => {
  const metricRepo = useMetricRepository();
  const metricCache = useCacheService(metricRepo);

  return {};
};
