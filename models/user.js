const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
});

// UserSchema.virtual("url").get(function() {
//   return "/user/" + this._id;
// });

UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    "miki-jwtKey"
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
