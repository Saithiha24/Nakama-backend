const express = require("express");
const { protect } = require("../middle-ware/authMidlleware");
const { singIn, logIn, allUsers } = require("../controllers/auth");
const router = express.Router();

router.route("/auth/signin").post(singIn).get(protect, allUsers);
router.route("/auth/login").post(logIn);

module.exports = router;
