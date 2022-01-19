require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const csv = require("csvtojson");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./uploads");
  },
  filename(req, file, cb) {
    cb(null, `contents.csv`);
  },
});
const upload = multer({ storage: storage });

const { contentSchema } = require("./schema/content");

const db = mongoose.createConnection(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

// posting content
app.post("/books/new", async (req, res) => {
  const { title, story, userid, published_date } = req.body;

  const Content = db.model("content", contentSchema);
  try {
    const data = new Content({
      title: title,
      story: story,
      userid: userid,
      published_date: published_date,
    });
    const result = await data.save();
    res.json({
      ok: true,
      message: "Content added successfully",
    });
  } catch (error) {
    res.json({
      ok: false,
      message: error,
    });
  }
});

app.post("/books/newupload", upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, "/uploads/contents.csv");

  const jsonData = await csv().fromFile(filePath);

  const Content = db.model("content", contentSchema);
  try {
    for (let index = 0; index < jsonData.length; index++) {
      const data = new Content(jsonData[index]);
      const result = await data.save();
    }
    res.json({
      ok: true,
      message: "Contents added successfully",
    });
  } catch (error) {
    res.json({
      ok: false,
      message: error,
    });
  }
});

// getting contents

app.listen(PORT, () => {
  console.log(`served started at port ${PORT}`);
});
