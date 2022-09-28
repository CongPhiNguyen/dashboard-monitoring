const express = require("express");
const router = express.Router();
const vuiCoinsController = require("../controllers/vuiCoinsController");


router.get("/get-all-data", vuiCoinsController.getAllDataVui)

module.exports = router;
