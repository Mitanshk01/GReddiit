const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  subGId: {
    type: String,
  },
  dataDate: {
    type: Date,
  },
  noPosts: {
    type: Number,
  },
  noJoins: {
    type: Number,
  },
  noVisitors: {
    type: Number,
  },
  noDeletedReports: {
    type: Number,
  },
  noReports: {
    type: Number,
  },
});

const Stats = mongoose.model("Stats", statSchema);

module.exports = Stats;
