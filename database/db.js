const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/chat.db", (err) => {
  if (err) console.error("Error opening database:", err);
  else {
    console.log("Connected to SQLite");
    db.run("PRAGMA foreign_keys = ON");
  }
});

db.serialize(() => {
  // Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE
  )`);

  // Messages Table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    receiver TEXT NULL,  
    group_name TEXT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (receiver) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (group_name) REFERENCES groups(group_name) ON DELETE CASCADE,
    CHECK (
      (receiver IS NOT NULL AND group_name IS NULL) OR  
      (receiver IS NULL AND group_name IS NOT NULL)    
    )
  )`);

  // Groups Table
  db.run(`CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT UNIQUE
  )`);

  // Group Members Table
  db.run(`CREATE TABLE IF NOT EXISTS group_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT,
    username TEXT,
    FOREIGN KEY (group_name) REFERENCES groups(group_name) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
  )`);

  // db.run(`INSERT OR IGNORE INTO users (username) VALUES ('Esam'), ('William'), ('Omar')`);
  // db.run(`INSERT OR IGNORE INTO group_members (group_name, username) VALUES ('Developers', 'Omar'), ('Developers', 'William')`);
  // db.run(`INSERT OR IGNORE INTO messages (sender, receiver, message) VALUES ('William', 'Omar', 'Hello Omar!')`);
  // db.run(`INSERT OR IGNORE INTO messages (sender, group_name, message) VALUES ('Esam', 'Designers', 'Hello!')`);
});

module.exports = db;
