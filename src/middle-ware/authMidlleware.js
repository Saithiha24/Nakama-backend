const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.header.authorization &&
    req.header.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.header.authorization.split("")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(404);
      throw new Error("Something went wrong");
    }
  }
  if (!token) {
    res.status(404);
    throw new Error("Authorization failed, no token");
  }
});
