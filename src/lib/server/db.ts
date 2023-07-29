import Database from 'better-sqlite3';
import * as fs from 'fs';
import { schema } from '../utils/schema';
const databasePath = './database.db';

// Check if the database file exists
const databaseExists = fs.existsSync(databasePath);

// If the database file doesn't exist, create it and execute the schema query
if (!databaseExists) {
	const initDB = new Database(databasePath);
	initDB.exec(schema);
	initDB.close();
}

/**
 * Create a new Database instance and configure it
 * Enable Write-Ahead Logging (WAL) mode for better performance
 *
 * This code is responsible for setting up the SQLite database using better-sqlite3.
 * It first checks if a database file exists at the given path.
 * If no file exists, it creates one and initializes it by executing the provided schema query.
 * It also sets SQLite's 'journal_mode' to 'WAL' (Write-Ahead Logging), which can improve performance.
 */
export const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
