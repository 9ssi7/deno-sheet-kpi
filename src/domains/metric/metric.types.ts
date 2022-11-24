export type Metric = "revenue" | "sessions" | "conversion" | "net-revenue";

export function isMetric(value: any): value is Metric {
  return (
    typeof value === "string" &&
    ["revenue", "sessions", "conversion", "net-revenue"].includes(value)
  );
}
