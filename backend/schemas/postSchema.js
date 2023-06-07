const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "*Required Field"],
  },
  text: {
    type: String,
    required: [true, "*Required Field"],
  },
  postedBy: {
    type: String,
  },
  postedId: {
    type: String,
  },
  upVotes: {
    type: Number,
  },
  downVotes: {
    type: Number,
  },
  voteType: {
    type: Number,
  },
  savedBy: {
    type: Array,
  },
  pageName: {
    type: String,
  },
});

const Post = mongoose.model("postSchema", postSchema);

module.exports = Post;
