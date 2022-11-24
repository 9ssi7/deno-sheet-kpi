import { Metric } from "./metric.types.ts";
import { MetricQuery } from "./metric.query.ts";
import { MetricSchema } from "./metric.schema.ts";
import { useDatabase } from "../../database/mongo.ts";

export type MetricRepository = {
  insertMetrics: (metrics: MetricSchema[]) => Promise<unknown>;
  deleteAllMetrics: () => Promise<unknown>;
  getAllByMetric: (metric: Metric, ...params: any[]) => Promise<MetricResponse>;
};

export type MetricResponse = {
  metric?: Metric;
  dimensions?: string[];
  aggregation?: string;
  data?: Record<string, { value: number }>;
};

export const useMetricRepository = (): MetricRepository => {
  const metricCollection = useDatabase().collection<MetricSchema>("metrics");

  const deleteAllMetrics = async () => {
    await metricCollection.deleteMany({});
  };

  const insertMetrics = async (metrics: MetricSchema[]) => {
    const batchSize = 2000;
    const batches = Math.ceil(metrics.length / batchSize);
    for (let i = 0; i < batches; i++) {
      const batch = metrics.slice(i * batchSize, (i + 1) * batchSize);
      await metricCollection.insertMany(batch);
    }
  };

  const getAllByMetric = async (
    metric: Metric,
    ...params: any[]
  ): Promise<MetricResponse> => {
    const resp: MetricResponse = {};
    await metricCollection
      .aggregate(MetricQuery[metric].queryCreator(...params))
      .map(MetricQuery[metric].mapper(resp, ...params));

    return resp;
  };

  return {
    deleteAllMetrics,
    insertMetrics,
    getAllByMetric,
  };
};
