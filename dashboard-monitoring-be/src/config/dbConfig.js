require("dotenv").config();

const mongoose = require("mongoose");
const DATABASE_NAME = process.env.DATABASE_NAME;
const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@authen-app.snsagpn.mongodb.net/${DATABASE_NAME}`;
const URI2 =
  "mongodb+srv://stream_user:BGCJMDHgkYrqC3Q8@taptap-datastream.jzu6a.mongodb.net/data_timeseries_test";
module.exports = connectDB = async () => {
  try {
    await mongoose.connect(URI2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connecting to DB successfully!");

  } catch (error) {
    console.error(error);
  }
};
