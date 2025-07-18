const sqlite3 = require("sqlite3").verbose();

// Use environment variables with fallbacks
const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : process.env.DB_PATH || 'db.sqlite';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log(`Connected to SQLite database: ${dbPath}`);
  }
});

// create table
db.run(`
    CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        url TEXT
    )
`, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  }
});

module.exports = db;