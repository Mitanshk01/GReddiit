const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "*Required Field"],
  },
  lastName: {
    type: String,
    required: [true, "*Required Field"],
  },
  userName: {
    type: String,
    required: [true, "*Required Field"],
  },
  emailId: {
    type: String,
    required: [true, "*Required Field"],
    unique: [true, "*User already exists"],
  },
  age: {
    type: Number,
    required: [true, "*Required Field"],
  },
  contactNumber: {
    type: String,
    required: [true, "*Required Field"],
  },
  passWord: {
    type: String,
    required: [true, "*Required Field"],
  },
  followers: {
    type: Array,
  },
  following: {
    type: Array,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
