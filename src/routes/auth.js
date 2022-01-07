const express = require("express");
const { protect } = require("../middle-ware/authMidlleware");
const { signIn, logIn, allUsers } = require("../controllers/auth");
const router = express.Router();

// SignIn
router.post("/signin", signIn);
router.get("signin", protect, allUsers);

// Login
router.post("/login", logIn);

module.exports = router;
