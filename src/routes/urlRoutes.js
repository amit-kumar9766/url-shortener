const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  deleteUrl,
} = require("../controllers/ormControllers");

router.post("/shorten", shortenUrl);
router.get("/redirect", redirectUrl);
router.delete("/delete/:code", deleteUrl);

module.exports = router;
