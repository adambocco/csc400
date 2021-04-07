
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("token");
  if (!token || token == null || token == "null") {
    req.user = false;
    next();
  }
  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.log(e)
    req.user = false;
    next();
  }
};