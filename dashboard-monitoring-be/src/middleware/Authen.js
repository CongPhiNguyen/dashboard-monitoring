require("dotenv").config();
const jwt = require("jsonwebtoken"); // authentication & authorization

function JWTAuthToken(data) {
  return (token = jwt.sign({ ...data }, process.env.JWT_SECRET, {
    expiresIn: 3600000,
  }));
}

function JWTVerify(token) {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      status: 200,
      decoded,
    };
  } catch (err) {
    return {
      status: 401,
      err,
    };
  }
}

async function AuthMiddleware(req, res, next) {
  jwt.verify(req.cookies._jwt, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      res.status(204).send({ success: false, err: err.message });
    } else {
      if (decoded?.userID) {
        req.userID = decoded.userID;
        next();
      } else res.status(204).send({ success: false, err: err.message });
    }
  });
}

module.exports = { JWTAuthToken, AuthMiddleware, JWTVerify };
