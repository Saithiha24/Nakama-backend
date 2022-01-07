const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Chat = require("../model/ChatModel");
const User = require("../model/UserModel");

exports.accesChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res.status(404).json({ message: "User token is not found" });
  if (userId) {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { $elemmatch: { users: { $eq: req.user._id } } },
        { $elemmatch: { users: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      try {
        let createChat = Chat.create({
          chatName: "sender",
          isGroupChat: "false",
          users: [req.user._id, userId],
        });
        const fullChat = User.findOne({ id: createChat._id }).populate(
          "name",
          "password"
        );
        return res.status(201).json({ fullChat });
      } catch (error) {
        return res.status(400).json({ message: error });
      }
    }
  }
});
