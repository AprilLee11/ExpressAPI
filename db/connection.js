const mongoose = require("mongoose");

const dev_db_url = "mongodb://localhost/mehn_drug";

if (process.env.NODE_ENV == "production") {
  mongoose.connect(process.env.mlab);
} else {
  mongoose.connect(dev_db_url);
}
mongoose.Promise = global.Promise;

module.exports = mongoose;
