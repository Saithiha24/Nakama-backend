const asyncHandler = require("express-async-handler");

const Chat = require("../model/ChatModel");
const User = require("../model/UserModel");

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "User is not found" });
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
      select: "name email pic",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let ChatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createChat = await Chat.create(ChatData);
        const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(fullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  }
});

exports.fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemmatch: { $eq: req.user._id } } })
      .populate("users", "-pw")
      .populate("GroupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .then((result) => {
        res.status(200).json({ result });
      });
  } catch (errror) {
    res.status(400);
    throw new Error("Something went wrong");
  }
});
