const express = require("express");
const router = express.Router();
const Drug = require("../models/drug");
const authGuard = require("../middlewares/authGuard");

router.get("/", (req, res, next) => {
  var perPage = 10;
  var page = req.params.page || 1;

  Drug.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(function(err, drug_list) {
      Drug.count().exec(function(err, count) {
        if (err) return next(err);
        res.json(drug_list);
      });
    });
});

router.get("/search", authGuard, (req, res, next) => {
  var query = req.param("query");

  Drug.aggregate([
    {
      $match: {
        $or: [
          { name: new RegExp(query, "i") },
          { indications: new RegExp(query, "i") },
          { activesubstances: new RegExp(query, "i") }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        indications: {
          $arrayElemAt: ["$indications", 0]
        },
        activesubstances: {
          $arrayElemAt: ["$activesubstances", 0]
        }
      }
    }
  ])
    .then(drugs => {
      res.json(drugs);
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

router.post("/edit/:id", (req, res, next) => {
  var indications = req.body.indications.split(",");
  var activesubstances = req.body.activesubstances.split(",");

  Drug.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        indications: { $each: indications },
        activesubstances: { $each: activesubstances }
      }
    },
    { new: true }
  )
    .exec()
    .then(drug => {
      res.json(drug);
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

router.get("/:id", (req, res, next) => {
  Drug.findById(req.params.id)
    .then(drug => {
      res.json(drug);
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

router.get("/search/drug", (req, res, next) => {
  var type = req.param("type");
  var query = req.param("query");
  Drug.find({ [type]: new RegExp(query, "i") })
    .then(drugs => {
      res.json(drugs);
    })
    .catch(err => {
      console.error("ERROR", err.message);
    });
});

module.exports = router;
