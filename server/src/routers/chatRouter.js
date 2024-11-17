const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/fetch-messages", chatController.fetchMessages);

module.exports = router;
