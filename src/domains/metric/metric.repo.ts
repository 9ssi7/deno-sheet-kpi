import { MetricSchema } from "./metric.schema.ts";
import { useDatabase } from "../../database/mongo.ts";

export const useMetricRepository = () => {
  const metricCollection = useDatabase().collection<MetricSchema>("metrics");

  const deleteAllMetrics = async () => {
    await metricCollection.deleteMany({});
  };

  const insertMetric = async (metric: MetricSchema) => {
    await metricCollection.insertOne(metric);
  };

  return {
    deleteAllMetrics,
    insertMetric,
  };
};
