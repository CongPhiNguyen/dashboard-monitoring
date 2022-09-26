const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vuiCoinsSchema = new Schema(
  {
    name: String,
    timestamp: Date,
    metadata: Object,
    hours: [
      {
        vuiGiving: Number,
        vuiSpending: Number,
      },
    ],
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "hours",
    },
    expireAfterSeconds: 24 * 7 * 60 * 60,
  }
);

module.exports = mongoose.model("vuiCoins", vuiCoinsSchema);
