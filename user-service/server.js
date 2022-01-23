require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { useSchema } = require("./schema/user.js");
const { checkAuth } = require("./middlewares/auth");

const app = express();
const db = mongoose.createConnection(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middlewares
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 7000;

app.post("/users/new", async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;
  const User = db.model("users", useSchema);
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const presentUser = await User.findOne({ email: email });
    if (presentUser) {
      res.send({
        ok: false,
        message: "User with given email already exists",
      });
      return;
    } else {
      const newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        password: hashPassword,
      });

      await newUser.save();
      res.send({
        ok: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    res.send({
      ok: false,
      message: error,
    });
  }
});

app.put("/users/update", checkAuth, async (req, res, next) => {
  const userData = req.body;
  const User = db.model("users", useSchema);

  try {
    const presentUser = await User.findOne({ email: userData.email });
    if (!presentUser) {
      res.send({
        ok: false,
        message: "User with given email doesn't exist",
      });
    } else {
      userData.password = await bcrypt.hash(userData.password, 10);
      await User.updateOne({ email: userData.email }, userData);
      res.send({
        ok: true,
        message: "User data updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: error,
    });
  }
});

app.delete("/users/delete", async (req, res) => {
  var userData = req.body;
  const User = db.model("users", useSchema);

  try {
    const presentUser = await User.findOne({ email: userData.email });
    if (!presentUser) {
      res.send({
        ok: false,
        message: "User with given email doesn't exist",
      });
    } else {
      await User.deleteOne({ email: userData.email });
      res.send({
        ok: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    res.send({
      ok: false,
      error: error,
    });
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const User = db.model("users", useSchema);
  try {
    const userData = await User.findOne({ email: email });
    if (!userData) {
      res.send({
        ok: false,
        message: "User with given email doesn't exist",
      });
    } else {
      const result = await bcrypt.compare(password, userData.password);
      if (result) {
        const token = await jwt.sign({ user: email }, process.env.SECRET_KEY);
        res.cookie("authtoken", token);
        res.send({
          ok: true,
          message: "Login Successfull",
        });
      } else {
        res.send({
          ok: false,
          message: "Invalid Email or password",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: error,
    });
  }
});

app.post("/users/auth", checkAuth, async (req, res) => {
  res.send({
    ok: true,
    message: "Login Verified",
  });
  const response = await axios.post("http://localhost:7000/users/auth", {
    headers: {},
  });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
