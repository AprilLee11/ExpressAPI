const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.post("/", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        return bcrypt.compare(req.body.password, user.password).then(result => {
          if (result) {
            const token = user.generateAuthToken();
            res.json(token);
          } else {
            res.status(400).json({ message: "Invalid email or password." });
          }
        });
      } else res.status(400).json({ message: "Invalid email or password." });
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

module.exports = router;
