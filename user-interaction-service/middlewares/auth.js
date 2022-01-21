const axios = require("axios");
const { response } = require("express");

const checkAuth = async (req, res, next) => {
  const { response: data } = await axios.post(
    "http://localhost:7000/users/auth"
  );

  if (response.ok == true) {
    next();
    return;
  } else {
    res.send({
      ok: false,
      message: response.message,
    });
    return;
  }
};

module.exports = { checkAuth };
