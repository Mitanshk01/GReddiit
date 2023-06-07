const mongoose = require("mongoose");

const subGredditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "*Required Field"],
    unique: [true, "*SubGreddit page with this name already exists"],
  },
  description: {
    type: String,
  },
  tags: {
    type: Array,
    lowercase: true,
  },
  bannedKeyWords: {
    type: Array,
    lowercase: true,
  },
  moderators: {
    type: Array,
  },
  members: {
    type: Array,
  },
  profImage: {
    type: String,
    required: [true, "*Required Image"],
  },
  joinrequests: {
    type: Array,
  },
  creationDate: {
    type: Date,
  },
  noPosts: {
    type: Number,
  },
  blockedMembers: {
    type: Array,
  },
  leftMembers: {
    type: Array,
  },
});

// lowercase : true would always convert a word into lowercase before using it...

const SubGreddit = mongoose.model("subGreddit", subGredditSchema);

module.exports = SubGreddit;
