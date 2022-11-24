import { MetricSchema } from "./metric.schema.ts";
export const useMetricMapper = () => {
  const mapCsvToMetricSchema = (
    csv: any[],
    eachCallback: (schema: MetricSchema) => Promise<unknown>
  ): Promise<MetricSchema[]> => {
    const promises: Promise<unknown>[] = [];
    const [header, ...rows] = csv;
    const list = rows.map((row: Array<any>) =>
      row.reduce((acc, value, index) => {
        if (MetricParsers[header[index]]) {
          acc[header[index]] = MetricParsers[header[index]](value);
        } else {
          acc[header[index]] = value;
        }
        promises.push(eachCallback(acc));
        return acc;
      }, {})
    );
    return Promise.all(promises).then(() => list);
  };

  return {
    mapCsvToMetricSchema,
  };
};

const MetricParsers: Record<string, (val: string) => unknown> = {
  event_time: (value: string) => new Date(value),
  price: (value: string) => parseFloat(value),
};
