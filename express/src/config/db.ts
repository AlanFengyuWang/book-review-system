// src/config/db.ts
import pgPromise from "pg-promise";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the appropriate .env file
const envFilePath = path.resolve(__dirname, "../../env/development.env");
dotenv.config({ path: envFilePath });

const pgp = pgPromise();

// Ensure DATABASE_URL is defined or provide a fallback
const dbConnectionString = process.env.DATABASE_URL as string;

if (!dbConnectionString) {
	throw new Error(
		"DATABASE_URL is not defined in the environment variables."
	);
}

const db = pgp(dbConnectionString);

export default db;
