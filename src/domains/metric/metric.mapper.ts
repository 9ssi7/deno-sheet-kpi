import { MetricSchema } from "./metric.schema.ts";
export const useMetricMapper = () => {
  const mapCsvToMetricSchema = (csv: any[]): MetricSchema[] => {
    const [header, ...rows] = csv;
    return rows.map((row: Array<any>) => {
      return row.reduce((acc, value, index) => {
        if (MetricParsers[header[index]]) {
          acc[header[index]] = MetricParsers[header[index]](value);
        } else {
          acc[header[index]] = value;
        }
        return acc;
      }, {});
    });
  };

  return {
    mapCsvToMetricSchema,
  };
};

const MetricParsers: Record<string, (val: string) => unknown> = {
  event_time: (value: string) => new Date(value),
  price: (value: string) => parseFloat(value),
};
