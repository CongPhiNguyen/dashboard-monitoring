const jwt = require("jsonwebtoken");
const KEY_JWT = process.env.KEY_JWT || "PHIPHUOC";

function JWTAuthToken(data) {
  return jwt.sign(
    { ...data },
    KEY_JWT,
    { expiresIn: "6000s" } // 10'
  );
}

function JWTVerify(token) {
  try {
    var decoded = jwt.verify(token, KEY_JWT);
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

const respone_401 = (res, err) => {
  res.status(401).send(
    JSON.stringify({
      status: 401,
      err: err.message,
    })
  );
};

async function AuthMiddleware(req, res, next) {
  try {
    const token = req.cookies._jwtService;
    // console.log("req.cookies", req.cookies);
    // console.log("token", token);
    if (!token) {
      res.status(401).send(JSON.stringify({ status: 401 }));
    } else {
      jwt.verify(token, KEY_JWT, (err, data) => {
        if (err) {
          respone_401(res, err);
        } else {
          res.locals.data = data;
          next();
        }
      });
    }
  } catch (err) {
    respone_401(res, err);
  }
}

module.exports = { JWTAuthToken, AuthMiddleware, JWTVerify };
