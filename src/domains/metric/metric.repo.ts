import { MetricSchema } from "./metric.schema.ts";
import { useDatabase } from "../../database/mongo.ts";

export type MetricRepository = {
  insertMetric: (metric: MetricSchema) => Promise<unknown>;
  deleteAllMetrics: () => Promise<unknown>;
};

export const useMetricRepository = (): MetricRepository => {
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
