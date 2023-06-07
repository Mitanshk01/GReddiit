const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postedBy: {
    type: String,
    required: [true, "*Required Field"],
  },
  postedText: {
    type: String,
    required: [true, "*Required Field"],
  },
  parentCommentId: {
    type: String,
  },
  postedSubGId: {
    type: String,
  },
  postedSubGName: {
    type: String,
  },
  subCommentsId: {
    type: Array,
  },
});

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;
