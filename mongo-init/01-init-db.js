const dbName = process.env.MONGO_INITDB_DATABASE;
if (!dbName) {
  throw new Error("MONGO_INITDB_DATABASE is not set");
}

const target = db.getSiblingDB(dbName);
target.createCollection("_init");
