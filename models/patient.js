const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PatientSchema = new Schema({
  age: { type: Number },
  gender: { type: String },
  reactions: { type: text },
  drugs: { type: [Schema.Types.ObjectId] },
  receivedate: { type: Date }
});

module.exports = mongoose.model("Patient", PatientSchema);
