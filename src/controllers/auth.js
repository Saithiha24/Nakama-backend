const User = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const jwtgenerator = async (id) => {
  const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password, pic } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist)
    return res.status(400).json({ message: "this email is already in used" });
  else {
    const hash_password = await bcrypt.hash(password, 10);
    const user = new User({
      name: req.body.name,
      email,
      password: hash_password,
      pic,
    });
    user.save((error, user) => {
      if (error)
        return res.status(404).json({ message: "something went wrong" });
      if (user) return res.status(201).json({ message: user });
    });
  }
});

// Login
exports.logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (user.comparedPw(password, user.password))
      return res.status(200).json({
        token: await jwtgenerator(user._id),
        user,
      });
    else return res.status(400).json("Someting went wrong");
  } else return res.status(400).json({ message: "User not found" });
});

// AllUser
exports.allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : null;
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
