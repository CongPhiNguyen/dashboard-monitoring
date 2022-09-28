const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { JWTAuthToken } = require("../middleware/JWT");

class userController {
  emitSocket = async (req, res) => {
    try {
      function randomIntFromInterval(min, max) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      let a = new Date();
      console.log(a.getTime())
      const data = {
        using: randomIntFromInterval(500, 1000),
        giving: randomIntFromInterval(501, 1000),
        date: a.getTime(),
      };

      global._io.emit("getData", { ...data });
      res.status(200).json({
        message: "Thành công",
      });
    } catch (err) {
      res.status(400).json({
        message: err.messages,
      });
    }
  };

  refresh = async (req, res) => {
    try {
      const { username } = res.locals.data;
      res.status(200).send(
        JSON.stringify({
          success: true,
          message: "Refresh thành công",
          status: 1,
          token: JWTAuthToken({ username }),
        })
      );
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  };

  resgister = async (req, res) => {
    try {
      const username = "admin";
      const password = "123456789";
      const salt = `qwertyuiopasdfghjklzxcvbnm`;
      Admin.create({
        username,
        password: bcrypt.hashSync(password + salt, saltRounds),
        salt,
      }).then((result) => {
        res.status(200).send(
          JSON.stringify({
            message: "Đăng ký thành công",
            status: 1,
          })
        );
      });
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  };

  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      // const admin = await Admin.findOne({ username }).exec();
      // console.log(admin);
      if (
        bcrypt.compareSync(
          password + "qwertyuiopasdfghjklzxcvbnm",
          "$2b$10$U1NlUK69A6WU7y1fLOCNKO9/rADMDZ0e2oPuEZvxM1nDsO0GwnUo2"
        ) &&
        username === "admin"
      ) {
        res.status(200).json({
          message: "Đăng nhập thành công",
          token: JWTAuthToken({ username }),
        });
      } else {
        res.status(200).json({
          message: "Mật khẩu không đúng",
        });
      }
    } catch (err) {
      res.status(400).json({
        err: err.message,
      });
    }
  };
}

module.exports = new userController();
