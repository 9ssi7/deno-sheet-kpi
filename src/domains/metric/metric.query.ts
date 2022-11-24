import type { AggregatePipeline } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Metric } from "./metric.types.ts";
import { MetricSchema } from "./metric.schema.ts";

type QueryCreatorAndMapper = {
  queryCreator: (...params: any[]) => AggregatePipeline<MetricSchema>[];
  mapper: (val: any) => any;
};

export const MetricQuery: Record<Metric, QueryCreatorAndMapper> = {
  revenue: {
    queryCreator: () => [
      {
        $match: {
          event_type: "purchase",
        },
      },
      {
        $group: {
          _id: "$brand",
          avg: { $avg: "$price" },
        },
      },
    ],
    mapper: (obj: any) => {
      obj.metric = "revenue";
      obj.dimensions = ["brand"];
      obj.aggregation = "avg";
      obj.data = {};
      return (data: any) => {
        obj.data[data._id] = { value: data.avg };
        return null;
      };
    },
  },
  sessions: {
    queryCreator: () => [
      {
        $group: {
          _id: { $week: "$event_time" },
          sessions: { $addToSet: "$user_session" },
        },
      },
    ],
    mapper: (obj: any) => {
      obj.metric = "sessions";
      obj.dimensions = ["date.weeknum"];
      obj.aggregation = "distinct";
      obj.data = {};
      return (data: any) => {
        obj.data[data._id] = { value: data.sessions.length };
        return null;
      };
    },
  },
  conversion: {
    queryCreator: () => [
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$event_time",
            },
          },
          sessions: { $addToSet: "$user_session" },
          purchases: {
            $addToSet: {
              $cond: [
                { $eq: ["$event_type", "purchase"] },
                "$user_session",
                null,
              ],
            },
          },
        },
      },
    ],
    mapper: (obj: any) => {
      obj.metric = "conversion";
      obj.dimensions = ["date"];
      obj.aggregation = "distinct";
      obj.data = {};
      return (data: any) => {
        const sessions = data.sessions.filter(Boolean).length;
        const purchases = data.purchases.filter(Boolean).length;
        obj.data[data._id] = {
          value: (purchases / sessions).toFixed(2),
          sessions,
          purchases,
        };
        return null;
      };
    },
  },
  "net-revenue": {
    queryCreator: () => [],
    mapper: (val: any) => val,
  },
};
