const userRouter = require("./user.js");
function route(app) {
  app.use("/api/user", userRouter);
}

module.exports = route;
