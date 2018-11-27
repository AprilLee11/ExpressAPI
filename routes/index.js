const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  res.json({ message: "It provides only API, there is not view." });
});

router.get("/welcome", function(req, res) {
  res.json({ message: "It provides only API, there is not view." });
});

module.exports = router;
