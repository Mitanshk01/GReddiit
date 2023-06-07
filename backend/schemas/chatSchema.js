const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatBetween: {
    type: Array,
  },
  chatText: {
    type: Array,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
