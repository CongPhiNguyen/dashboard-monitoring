const express = require("express");
const router = express.Router();
const vuiCoinsController = require("../controllers/vuiCoinsController");

router.post("/test", vuiCoinsController.test);
router.post("/init", vuiCoinsController.init);
router.post("/", vuiCoinsController.addData);
router.post("/add-fix", vuiCoinsController.addDataFix);
router.get("/time-series", vuiCoinsController.query);
router.get("/time-series-2", vuiCoinsController.queryTest);
module.exports = router;
