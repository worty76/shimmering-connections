const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/profile/:userId", userController.getUserData);
router.get("/profiles", userController.getProfiles);
router.post("/like", userController.likeProfile);
router.get("/received-likes/:userId", userController.receivedLikes);
router.post("/create-match", userController.createMatch);
router.get("/get-matches/:userId", userController.getMatches);

module.exports = router;
