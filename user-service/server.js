require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { useSchema } = require("./schema/user");
const app = express();
const db = mongoose.createConnection(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middlewares
app.use(express.json());

const PORT = process.env.DATABASE_URL || 7000;

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
    }

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
    }
    await User.updateOne({ email: email }, userData);
    res.send({
      ok: true,
      message: "User data updated successfully",
    });
  } catch (error) {
    res.send({
      ok: false,
      error: error,
    });
  }
});

app.delete("/users/delete", async (req, res) => {
  const userData = req.body;
  const User = db.model("users", useSchema);

  try {
    const presentUser = await User.findOne({ email: useData.email }, userData);
    if (!presentUser) {
      res.send({
        ok: false,
        message: "User with given email doesn't exist",
      });
    }
    await User.deleteOne({ email: email }, userData);
    res.send({
      ok: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.send({
      ok: false,
      error: error,
    });
  }
});
