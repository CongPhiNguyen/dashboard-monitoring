const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/dbConfig.js"); // connect MongoDB
const PORT = process.env.PORT || 5000; // port number
const app = express();
const route = require("./src/routers/index"); // router impl
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

connectDB();

route(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
