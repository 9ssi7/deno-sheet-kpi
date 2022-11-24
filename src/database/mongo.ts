import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const uri = "mongodb://localhost:27017";
const dbName = "deno-sheet-kpi";

const mongo = new MongoClient();

export const connect = () => {
  console.log("Connecting to MongoDB...");
  return mongo.connect(uri);
};

export const useDatabase = () => mongo.database(dbName);
