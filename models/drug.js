const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var DrugSchema = new Schema({
  name: { type: String },
  indications: { type: text },
  activesubstances: { type: text }
});

module.exports = mongoose.model("Drug", DrugSchema);
