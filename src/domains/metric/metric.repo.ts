import { MetricSchema } from "./metric.schema.ts";
import { useDatabase } from "../../database/mongo.ts";

export const useMetricRepository = () => {
  const metricCollection = useDatabase().collection<MetricSchema>("metrics");
  return {};
};
