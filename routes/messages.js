const express = require("express");
const db = require("../database/db");
const router = express.Router();

function userExists(username) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT username FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
}
router.get("/private/:username", (req, res) => {
  const { username } = req.params;

  userExists(username)
    .then((exists) => {
      if (!exists) {
        return res.status(404).json({ error: "User not found" });
      }

      db.all(
        `SELECT * FROM messages WHERE sender = ? OR receiver = ? ORDER BY timestamp DESC LIMIT 20`,
        [username, username],
        (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows);
        }
      );
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/group/:groupName", (req, res) => {
  const { groupName } = req.params;
  db.all(
    `SELECT * FROM messages WHERE group_name = ? ORDER BY timestamp DESC LIMIT 20`,
    [groupName],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;
