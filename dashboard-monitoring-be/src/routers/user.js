const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();
const { AuthMiddleware } = require("../middleware/Authen");

router.post("/sign-up", userController.signUp);
router.post("/login", userController.signIn);
router.get("/refresh", AuthMiddleware, userController.refresh);

module.exports = router;
