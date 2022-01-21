const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
  const { authtoken } = req.cookies;

  if (!authtoken) {
    res.send({
      ok: false,
      message: "User not logged in",
    });
    return;
  }

  const result = jwt.verify(authtoken, process.env.SECRET_KEY);

  if (!result) {
    res.clearCookie("authtoken");
    res.send({
      ok: false,
      message: "Unauthorized access",
    });
    return;
  }
  next();
};

module.exports = { checkAuth };
