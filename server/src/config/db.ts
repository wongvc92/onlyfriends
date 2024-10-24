import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.log("Please provide databse url");
}
const pool = new Pool({
  connectionString,
});

export default pool;
