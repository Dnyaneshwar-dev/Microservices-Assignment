require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const { checkAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

// User Interaction Servic API's
app.post("/content/like", checkAuth, async (req, res) => {
  res.redirect(307, "http://localhost:6000/content/like");
});

app.post("/content/read", checkAuth, async (req, res) => {
  res.redirect(307, "http://localhost:6000/content/read");
});

// content-service API's
app.post("/content/new", async (req, res) => {
  res.redirect(307, "http://localhost:5000/content/new");
});

app.post("/books/newupload", async (req, res) => {
  res.redirect(307, "http://localhost:5000/content/newupload");
});

app.get("/content/mostliked", async (req, res) => {
  res.redirect(307, "http://localhost:5000/content/mostliked");
});

app.get("/content/mostread", async (req, res) => {
  res.redirect(307, "http://localhost:5000/content/mostread");
});

// user service API's

app.post("/users/new", async (req, res) => {
  res.redirect(307, "http://localhost:7000/users/new");
});

app.put("/users/update", checkAuth, async (req, res, next) => {
  res.redirect(307, "http://localhost:7000/users/update");
});

app.delete("/users/delete", checkAuth, async (req, res) => {
  res.redirect(307, "http://localhost:7000/users/delete");
});

app.post("/users/login", async (req, res) => {
  res.redirect(307, "http://localhost:7000/users/login");
});

app.listen(PORT, () => {
  console.log(`Server Started at port ${PORT}`);
});
