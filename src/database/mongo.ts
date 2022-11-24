import { AppVariables } from "../config/variables.enum.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getRequiredEnv } from "./../config/env.ts";

const uri = getRequiredEnv<string>(AppVariables.MONGO_URI);
const dbName = getRequiredEnv<string>(AppVariables.MONGO_DB_NAME);

const mongo = new MongoClient();

export const connect = () => {
  console.log("Connecting to MongoDB...");
  return mongo.connect(uri);
};

export const useDatabase = () => mongo.database(dbName);
