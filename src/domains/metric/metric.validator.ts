import { Metric, isMetric } from "./metric.types.ts";

import { ValidationResult } from "../../types/validation.result.ts";

type FilterFunc<T> = (params: URLSearchParams) => ValidationResult<T>;

export const useMetricValidator = () => {
  const filterNetRevenue: FilterFunc<{ startDate: string; endDate: string }> = (
    params
  ) => {
    let startDate = params.get("filters.date.from");
    let endDate = params.get("filters.date.to");
    if (!startDate) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      startDate = date.toISOString().split("T")[0];
    }
    if (!endDate) {
      endDate = new Date().toISOString().split("T")[0];
    }
    return {
      success: true,
      key: "filters.date",
      result: {
        startDate,
        endDate,
      },
    };
  };

  const filterByMetric = (
    metric: Metric,
    params: URLSearchParams
  ): ValidationResult => {
    switch (metric) {
      case "net-revenue":
        return filterNetRevenue(params);
      default:
        return {
          success: true,
          key: "filters",
        };
    }
  };

  return {
    revenue: filterNetRevenue,
    filterByMetric,
  };
};
