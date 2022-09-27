const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vuiCoinsSchema = new Schema(
  {
    vuiIncrease: Number,
    vuiDecrease: Number,
    timestamp: Date,
    metadata: {},
    minutes: {},
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "minutes",
    },
    expireAfterSeconds: 24 * 7 * 60 * 60,
  }
);

module.exports = mongoose.model("vuiCoins", vuiCoinsSchema);
