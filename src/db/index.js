import Database from "better-sqlite3";
import config from "../../config/env";

const db = new Database(config.db, {});

const initQuery = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  userName TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT,
  lastName TEXT
);`;

db.prepare(initQuery).run();

export default db;
