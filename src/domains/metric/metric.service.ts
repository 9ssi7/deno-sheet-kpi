import { type Metric } from "./metric.types.ts";
import { useCacheService } from "./metric.cache-service.ts";
import { useMetricRepository } from "./metric.repo.ts";

export const useMetricService = () => {
  const metricRepo = useMetricRepository();
  const metricCache = useCacheService(metricRepo);

  metricCache.resetCache();

  const handleMetric = async (
    metric: Metric,
    ...params: any[]
  ): Promise<any> => {
    await metricCache.checkCache();
    return metricRepo.getAllByMetric(metric as Metric, ...params);
  };

  return {
    handleMetric,
  };
};
