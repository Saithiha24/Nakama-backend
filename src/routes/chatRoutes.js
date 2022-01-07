const express = require("express");
const { accessChat, fetchChat } = require("../controllers/chat");
const { protect } = require("../middle-ware/authMidlleware");
const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);
// router.route("/").get(protect, fetchChat);
module.exports = router;
