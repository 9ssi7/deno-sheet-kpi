export type Metric = "revenue" | "sessions" | "conversion" | "net-revenue";

export function isMetric(value: unknown): value is Metric {
  return (
    typeof value === "string" &&
    ["revenue", "sessions", "conversion", "net-revenue"].includes(value)
  );
}

type BaseMetricResponse = {
  metric: Metric;
  dimensions: string[];
  aggregation: string;
};

type NetRevenueResponse = {
  filter: {
    date: {
      from: string;
      to: string;
    };
  };
  data: Record<string, { value: number }[]>;
} & BaseMetricResponse;

type ConversionResponse = {
  data: Record<string, { session: number; purchases: number; value: string }[]>;
} & BaseMetricResponse;

type WeeklySessionResponse = {
  data: Record<string, { value: string }[]>;
} & BaseMetricResponse;

type RevenueResponse = {
  data: Record<string, { value: string }[]>;
} & BaseMetricResponse;

export type MetricResponse =
  | NetRevenueResponse
  | ConversionResponse
  | WeeklySessionResponse
  | RevenueResponse;

export type NetRevenueQueryParams = {
  startDate: string;
  endDate: string;
};
