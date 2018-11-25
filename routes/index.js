const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
  res.redirect("/welcome");
});

router.get("/welcome", function(req, res) {
  res.json({ message: "Welcome!!" });
});

module.exports = router;
