const userRouter = require("./user.js");
function route(app) {
  app.use("/api/v1/user", userRouter);
}

module.exports = route;
