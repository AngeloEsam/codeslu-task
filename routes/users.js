const express = require("express");
const db = require("../database/db");
const router = express.Router();

router.get("/", (req, res) => {
  db.all(`SELECT username FROM users`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
