const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const checkTokenAuthen = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ auth: "Token not found." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: err.message });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = { checkTokenAuthen};

