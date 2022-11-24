import { AppVariables } from "../../config/variables.enum.ts";
import type { MetricRepository } from "./metric.repo.ts";
import { getRequiredEnv } from "../../config/env.ts";
import { useMetricMapper } from "./metric.mapper.ts";

export type MetricCacheService = {
  checkCache: () => Promise<void>;
  setCache: () => Promise<void>;
  deleteCache: () => Promise<void>;
};

export const useCacheService = (repo: MetricRepository) => {
  const metricMapper = useMetricMapper();

  const state = {
    lastCacheTime: 0,
    cacheTimeout: getRequiredEnv<number>(AppVariables.CACHE_TIMEOUT),
  };

  const url = getRequiredEnv<string>(AppVariables.SPREADSHEET_URL);
  const apiKey = getRequiredEnv<string>(AppVariables.SPREADSHEET_API_KEY);
  const rangeName = getRequiredEnv<string>(AppVariables.SPREADSHEET_RANGE_NAME);
  const spreadsheetId = getRequiredEnv<string>(AppVariables.SPREADSHEET_ID);

  const checkCache = async () => {
    if (
      Math.floor(Date.now() / 1000) - state.lastCacheTime >
      state.cacheTimeout
    ) {
      await repo.deleteAllMetrics();
      state.lastCacheTime = Math.floor(Date.now() / 1000);
      await setCache();
    }
  };

  const setCache = async () => {
    const res = await fetch(
      `${url}/${spreadsheetId}/values/${rangeName}?key=${apiKey}`
    );
    const data = await res.json();
    await metricMapper.mapCsvToMetricSchema(data.values, repo.insertMetric);
  };

  const deleteCache = async () => {
    await repo.deleteAllMetrics();
  };

  return {
    checkCache,
    setCache,
    deleteCache,
  };
};
