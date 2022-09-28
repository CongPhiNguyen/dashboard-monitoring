const express = require("express");
const router = express.Router();
const vuiCoinsController = require("../controllers/vuiCoinsController");

router.get("/get-all-data", vuiCoinsController.getAllDataVui)
router.get("/get-data-week", vuiCoinsController.getDataWeek)
router.get("/get-data-day", vuiCoinsController.getDataDay)
router.get("/get-data-hours", vuiCoinsController.getDataHours)

module.exports = router;
