const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: String,
    required: [true, "*Required Field"],
  },
  reportedUser: {
    type: String,
  },
  reportedText: {
    type: String,
    required: [true, "*Required"],
  },
  reportConcern: {
    type: String,
    required: [true, "*Required"],
  },
  reportedPostId: {
    type: String,
  },
  reportedSubGId: {
    type: String,
  },
  reportOutcome: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: 864000
  },
});

const Report = mongoose.model("reportSchema", reportSchema);

module.exports = Report;
