const userRouter = require("./user.js");
const vuiCoinsRouter = require("./vuiCoins.js");
function route(app) {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/vui-coins", vuiCoinsRouter);
}

module.exports = route;
