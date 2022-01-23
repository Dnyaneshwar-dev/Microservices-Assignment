const axios = require("axios");
const api = axios.create({
  withCredentials: true,
});
const checkAuth = async (req, res, next) => {
  console.log(req.cookies);
  const response = await api.post("http://localhost:7000/users/auth", {});
  if (response.data.ok == true) {
    next();
    return;
  } else {
    res.send({
      ok: false,
      message: response.data.message,
    });
    return;
  }
};

module.exports = { checkAuth };
