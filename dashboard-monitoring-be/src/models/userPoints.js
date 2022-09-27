const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userpointSchema = new Schema(
  {
    value: Number,
    data: {
      type: String,
      event: String,
    },
    createdAt: Date,
  },
  {
    timeseries: {
      timeField: "createdAt",
      metaField: "data",
      granularity: "seconds",
    },
    expireAfterSeconds: 24 * 7 * 60 * 60,
  }
);

module.exports = mongoose.model("user_point", userpointSchema);
