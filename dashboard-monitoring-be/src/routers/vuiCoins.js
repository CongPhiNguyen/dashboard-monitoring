const express = require("express");
const router = express.Router();
const vuiCoinsController = require("../controllers/vuiCoinsController");

router.get("/get-all-data", vuiCoinsController.getAllDataVui);
router.get("/get-data-by-week", vuiCoinsController.getDataByWeek);
router.get("/get-data-by-day", vuiCoinsController.getDataByDay);
router.get("/get-data-by-hour", vuiCoinsController.getDataByHour);
router.get("/get-data-by-minute", vuiCoinsController.getDataByMinute);
router.get("/get-concrete-value", vuiCoinsController.getConcreteValue);
router.get("/get-concrete-data", vuiCoinsController.getConcreteData);
router.get("/get-transaction", vuiCoinsController.getTransactionDataInMinute);
router.get(
  "/get-concrete-transaction",
  vuiCoinsController.getConcreteTransactionData
);

module.exports = router;
