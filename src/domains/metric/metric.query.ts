import { Metric } from "./metric.types.ts";

type QueryCreatorAndMapper = {
  queryCreator: (...params: any[]) => any[];
  mapper: (val: any) => any;
};

export const MetricQuery: Record<Metric, QueryCreatorAndMapper> = {
  revenue: {
    queryCreator: () => [],
    mapper: (val: any) => val,
  },
  sessions: {
    queryCreator: () => [],
    mapper: (val: any) => val,
  },
  conversion: {
    queryCreator: () => [],
    mapper: (val: any) => val,
  },
  "net-revenue": {
    queryCreator: () => [],
    mapper: (val: any) => val,
  },
};
