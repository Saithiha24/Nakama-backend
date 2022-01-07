const express = require("express");
const { accesChat } = require("../controllers/chat");
const { protect } = require("../middle-ware/authMidlleware");
const router = express.Router();

router.route("/").post(protect, accesChat);
module.exports = router;
