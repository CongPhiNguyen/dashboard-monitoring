const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { AuthMiddleware } = require("../middleware/JWT");

router.get("/emitSocket", userController.emitSocket)
router.get("/refresh", AuthMiddleware, userController.refresh);
router.get("/resgister", userController.resgister);
router.post("/login", userController.login);

module.exports = router;
