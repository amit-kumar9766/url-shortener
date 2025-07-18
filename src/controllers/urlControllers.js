const db = require("../../db/index");
const crypto = require("crypto");

exports.shortenUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  const code = crypto.randomBytes(3).toString("hex");

  try {
    const existing = await new Promise((resolve, reject) => {
      db.get("SELECT code FROM urls WHERE url = ?", [url], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existing) {
      return res.json({ code: existing.code });
    }
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO urls (code, url) VALUES (?, ?)",
        [code, url],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: "Could not shorten URL" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code parameter");

  try {
    const row = await new Promise((resolve, reject) => {
      db.get("SELECT url FROM urls WHERE code = ?", [code], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    if (row) {
      res.status(200).json(row.url);
    } else {
      res.status(404).send("Short code not found");
    }
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).send("Server error");
  }
};
