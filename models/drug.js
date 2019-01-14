const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var DrugSchema = new Schema({
  name: { type: String },
  indications: { type: String },
  activesubstances: { type: String }
});

module.exports = mongoose.model("Drug", DrugSchema);
