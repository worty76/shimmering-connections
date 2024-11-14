const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/profile/:userId", userController.getUserData);
router.get("/profiles", userController.getProfiles);
router.get("/like", userController.sendLike);

module.exports = router;
