import { type Metric, isMetric } from "./metric.types.ts";
import { useCacheService } from "./metric.cache-service.ts";
import { useMetricRepository } from "./metric.repo.ts";

export const useMetricService = () => {
  const metricRepo = useMetricRepository();
  const metricCache = useCacheService(metricRepo);

  metricCache.resetCache();

  const handleMetric = async (metric: string): Promise<any> => {
    await metricCache.checkCache();
    if (isMetric(metric)) {
      return metricRepo.getAllByMetric(metric as Metric);
    }
    return { error: "Invalid metric" };
  };

  return {
    handleMetric,
  };
};
