import { AppVariables } from "../../config/variables.enum.ts";
import type { MetricRepository } from "./metric.repo.ts";
import { getRequiredEnv } from "../../config/env.ts";
import { useMetricMapper } from "./metric.mapper.ts";

export type MetricCacheService = {
  checkCache: () => Promise<boolean>;
  setCache: () => Promise<void>;
  deleteCache: () => Promise<void>;
};

export const useCacheService = (repo: MetricRepository) => {
  const metricMapper = useMetricMapper();

  const state = {
    refreshing: false,
    lastCacheTime: 0,
    cacheTimeout: getRequiredEnv<number>(AppVariables.CACHE_TIMEOUT),
  };

  const url = getRequiredEnv<string>(AppVariables.SPREADSHEET_URL);
  const apiKey = getRequiredEnv<string>(AppVariables.SPREADSHEET_API_KEY);
  const rangeName = getRequiredEnv<string>(AppVariables.SPREADSHEET_RANGE_NAME);
  const spreadsheetId = getRequiredEnv<string>(AppVariables.SPREADSHEET_ID);

  const checkCache = async (): Promise<boolean> => {
    if (state.refreshing) return false;
    if (
      Math.floor(Date.now() / 1000) - state.lastCacheTime >
      state.cacheTimeout
    ) {
      await resetCache();
    }
    return true;
  };

  const setCache = async () => {
    const res = await fetch(
      `${url}/${spreadsheetId}/values/${rangeName}?key=${apiKey}`
    );
    const data = await res.json();
    const metrics = metricMapper.mapCsvToMetricSchema(data.values);
    await repo.insertMetrics(metrics);
    state.lastCacheTime = Math.floor(Date.now() / 1000);
  };

  const deleteCache = async () => {
    await repo.deleteAllMetrics();
    state.lastCacheTime = 0;
  };

  const resetCache = async () => {
    state.refreshing = true;
    console.log("Resetting cache...");
    await deleteCache();
    console.log("Cache reset!");
    console.log("Setting cache...");
    await setCache();
    console.log("Cache set!");
    state.refreshing = false;
  };

  resetCache();

  setInterval(async () => {
    await resetCache();
  }, state.cacheTimeout * 1000);

  return {
    checkCache,
    setCache,
    deleteCache,
    resetCache,
  };
};
