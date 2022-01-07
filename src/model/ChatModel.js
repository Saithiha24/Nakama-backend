// type of models for Chat App
// chatName
// users
// isGroupChat
// lastestMessage
// groupAdmin

const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
