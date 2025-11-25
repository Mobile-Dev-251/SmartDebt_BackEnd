import pkg from "pg";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

 const sql = neon(process.env.DATABASE_URL);
 // const { Pool } = pkg;

 // const pool = new Pool({
 //   user: process.env.DB_USER,
 //   host: process.env.DB_HOST,
 //   database: process.env.DB_NAME,
 //   password: process.env.DB_PASSWORD,
 //   port: process.env.DB_PORT,
 // });

 // pool.on("connect", () => {
 //   console.log("Connection pool established with Database");
 // });
 // export default pool;
 export default sql;
