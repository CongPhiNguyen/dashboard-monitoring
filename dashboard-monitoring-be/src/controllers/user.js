const user = require("../models/user");
const bcrypt = require("bcrypt");
const SALT_ROUND = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

class userController {
  signUp = async (req, res) => {
    // console.log("req.body", req.body);
    new user({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, SALT_ROUND),
    })
      .save()
      .then((data) => {
        // console.log(data);
        res
          .status(200)
          .send({ success: true, data: data, message: "Sign up success" });
      })
      .catch((err) => {
        // console.log(err, err);
        res.status(204).send({
          success: false,
          err: err.message,
          message: "Sign up failed",
        });
      });
  };
  signIn = async (req, res) => {
    console.log("req.body", req.body);
    user
      .findOne({ username: req.body.username })
      .then((data) => {
        if (data === null) {
          throw Error("Username not found");
        } else {
          if (!bcrypt.compareSync(req.body.password, data.password))
            throw Error("Password not match");
          console.log(data);
          let token = jwt.sign(
            {
              userID: data._id,
              username: data.username,
            },
            JWT_SECRET
          );
          res.status(200).send({ success: true, token: token });
        }
      })
      .catch((err) => {
        // console.log("err", err);
        res.status(204).send({ success: false, error: err.message });
      });
  };
  refresh = async (req, res) => {
    // console.log(req.body);
    console.log("req.userID", req.userID);
    res.status(200).send({ success: true });
  };
}

module.exports = new userController();
