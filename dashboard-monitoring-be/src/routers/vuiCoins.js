const express = require("express");
const router = express.Router();
const vuiCoinsController = require("../controllers/vuiCoinsController");

router.post("/test", vuiCoinsController.test);
router.post("/init", vuiCoinsController.init);
router.post("/", vuiCoinsController.addData);
module.exports = router;
