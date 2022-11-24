import { getRequiredEnv } from "../../config/env.ts";
import { useMetricMapper } from "./metric.mapper.ts";
import { useMetricRepository } from "./metric.repo.ts";

export const useMetricService = () => {
  const metricRepo = useMetricRepository();
  const metricMapper = useMetricMapper();

  const state = {
    lastCacheTime: 0,
    cacheTimeout: getRequiredEnv<number>("CACHE_TIMEOUT"),
  };

  const checkCache = async () => {
    if (
      Math.floor(Date.now() / 1000) - state.lastCacheTime >
      state.cacheTimeout
    ) {
      await metricRepo.deleteAllMetrics();
      state.lastCacheTime = Math.floor(Date.now() / 1000);
      await setCache();
    }
  };

  const setCache = async () => {
    const res = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1frVzuJCImzpP-zEhSrzuQGV0rUp3mFxV5OfG0z1UZYg/values/Dataset?key=AIzaSyBT1Ocw5s5H07w1T2_FSejqCEEhbZTvSME"
    );
    const data = await res.json();
    await metricMapper.mapCsvToMetricSchema(
      data.values,
      metricRepo.insertMetric
    );
  };

  return {};
};
