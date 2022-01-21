require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { useSchema } = require("./schema/user.js");

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
        password: password,
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
      error: error,
    });
  }
});

app.put("/users/update", async (req, res) => {
  const userData = req.body;
  const User = db.model("users", useSchema);

  try {
    const presentUser = await User.findOne({ email: userData.email }, userData);
    if (!presentUser) {
      res.send({
        ok: false,
        message: "User with given email doesn't exist",
      });
    } else {
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
      error: error,
    });
  }
});

app.delete("/users/delete", async (req, res) => {
  console.log(req.cookies);
  const userData = req.body;
  const User = db.model("users", useSchema);

  try {
    const presentUser = await User.findOne({ email: userData.email }, userData);
    if (!presentUser) {
      res.send({
        ok: false,
        message: "User with given email doesn't exist",
      });
    } else {
      await User.deleteOne({ email: userData.email }, userData);
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

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
