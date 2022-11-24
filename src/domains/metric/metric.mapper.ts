import type { MetricSchema } from "./metric.schema.ts";

export type MetricMapper = {
  mapCsvToMetricSchema: (csv: any[]) => MetricSchema[];
};

const MetricParsers: Record<string, (val: string) => unknown> = {
  event_time: (value: string) => new Date(value),
  price: (value: string) => parseFloat(value),
};

export const useMetricMapper = (): MetricMapper => {
  const mapCsvToMetricSchema = (csv: any[]): MetricSchema[] => {
    const [header, ...rows] = csv;
    return rows.map((row: Array<any>) =>
      row.reduce((acc, value, index) => {
        acc[header[index]] = MetricParsers[header[index]]
          ? MetricParsers[header[index]](value)
          : value;
        return acc;
      }, {})
    );
  };

  return {
    mapCsvToMetricSchema,
  };
};
