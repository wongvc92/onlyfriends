import { Pool } from "pg";

import { config } from "./app.config";

const connectionString = config.DATABASE_URL;

if (!connectionString) {
  console.log("Please provide database url");
}
const pool = new Pool({
  connectionString,
});

export default pool;
