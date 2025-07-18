const crypto = require("crypto");
const { Url } = require("../models");

exports.shortenUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const existing = await Url.findOne({ where: { originalUrl: url } });

    if (existing) {
      return res.json({ shortUrl: existing.shortUrl });
    }
    const code = crypto.randomBytes(3).toString("hex");
    await Url.create({
      originalUrl: url,
      shortUrl: code,
    });
    res.json({ shortUrl: code });
  } catch (err) {
    res.status(500).json({ error: "Could not shorten URL" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Missing code parameter");
  }
  try {
    const entry = await Url.findOne({ where: { shortUrl: code } });
    if (entry) {
      res.json({ url: entry.originalUrl });
    } else {
      res.status(404).send("Short code not found");
    }
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).send("Server error");
  }
};


exports.deleteUrl = async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const deleted = await Url.destroy({ where: { shortUrl: code } });

    if (deleted) {
      return res.status(200).json({ message: "URL deleted successfully" });
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
