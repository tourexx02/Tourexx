const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// POST /api/chat/message - Send a message to GPT
router.post("/message", chatController.sendMessage);

module.exports = router;

