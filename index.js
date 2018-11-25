var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("./db/connection");

var index = require("./routes/index");
var users = require("./routes/users");
var drugs = require("./routes/drugs");
var auth = require("./routes/auth");

mongoose.set("debug", true);
mongoose.set("useFindAndModify", false);

var app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Headers", "Authorization");
  next();
});

app.use("/", index);
app.use("/user", users);
app.use("/drug", drugs);
app.use("/auth", auth);

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(`PORT: ${app.get("port")}`);
});
module.exports = app;
