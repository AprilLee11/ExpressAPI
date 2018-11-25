const User = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const authGuard = require("../middlewares/authGuard");
const checkAdmin = require("../middlewares/checkAdmin");

router.get("/signup", async (req, res) => {
  res.render("user/signup");
});

router.get("/", [authGuard, checkAdmin], (req, res, next) => {
  User.find({})
    .then(users => {
      res.json(users);
      next();
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

router.post("/edit/:id", [authGuard, checkAdmin], (req, res, next) => {
  var name = req.body.name;
  var isAdmin = req.body.isAdmin === "true" ? true : false;

  User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: name,
        isAdmin: isAdmin
      }
    },
    { new: true }
  )
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

router.get("/delete/:id", [authGuard, checkAdmin], (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => res.json(user))
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

router.post("/", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        res.json({ message: "This email is already registered." });
        next();
      } else {
        return bcrypt
          .genSalt(10)
          .then(salt => {
            return bcrypt.hash(req.body.password, salt);
          })
          .then(hash => {
            var admin = req.body.isAdmin === "true" ? true : false;
            var user = new User({
              name: req.body.first_name + " " + req.body.last_name,
              email: req.body.email,
              password: hash,
              isAdmin: admin
            });
            return user.save();
          })
          .then(user => {
            res.json(user);
            next();
          });
      }
    })
    .catch(err => console.error("ERROR", err.message));
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user);
      next();
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

module.exports = router;
