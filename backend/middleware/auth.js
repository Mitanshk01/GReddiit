const jwt = require("jsonwebtoken");
const jwt_secret = "ahasjdlksdodlkewisowskjdsjlidoiw";
const User = require("../schemas/userSchema");

const auth = async (req, res, next) => {
  console.log("In Auth...!");
  const token = req.headers.authorization.split(":")[1];

  try {
    if (token) {
      const decoded = jwt.verify(token, jwt_secret);

      const emId = decoded.emailId;

      req.user = User.findOne({ emailId: emId }, (error, data) => {
        if (error) {
          return res.status(401).json({
            message: "Unauthorized User!",
          });
        } else {
          next();
        }
      });
    } else {
      return res.status(401).json({
        message: "Unauthorized User!",
      });
    }
  } catch {
    return res.status(401).json({
      message: "Unauthorized User!",
    });
  }
};

module.exports = auth;
