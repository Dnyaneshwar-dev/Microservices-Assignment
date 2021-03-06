require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const csv = require("csvtojson");
const path = require("path");
const { contentSchema } = require("./schema/content");
const { interactionSchema } = require("./schema/interactions");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./uploads");
  },
  filename(req, file, cb) {
    cb(null, `contents.csv`);
  },
});
const upload = multer({ storage: storage });

const db = mongoose.createConnection(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const interactiondb = mongoose.createConnection(
  process.env.INTERACTION_DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

// posting content
app.post("/content/new", async (req, res) => {
  var { title, story, userid, published_date } = req.body;
  published_date = new Date(published_date);

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

app.post("/content/newupload", upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, "/uploads/contents.csv");

  const jsonData = await csv().fromFile(filePath);

  const Content = db.model("content", contentSchema);
  try {
    for (let index = 0; index < jsonData.length; index++) {
      jsonData[index].published_date = new Date(jsonData[index].published_date);

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

// content sorted by date
app.get("/content/recent", async (req, res) => {
  const content = db.model("content", contentSchema);
  try {
    const data = await content.find().sort({ published_date: -1 });
    res.send({
      ok: true,
      message: "Content added successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      error: error,
    });
  }
});

// most read content

app.get("/content/mostliked", async (req, res) => {
  const content = db.model("content", contentSchema);
  const interactions = interactiondb.model("interactions", interactionSchema);

  try {
    const data = await interactions.find({}).sort({ likes: -1 });
    var mostLikedContent = [];
    var contentids = [];
    for (let index = 0; index < data.length; index++) {
      var contentData = await content.findOne({
        contentid: data[index].contentid,
      });
      if (contentData != null) {
        mostLikedContent.push({
          contentData,
          reads: data[index].reads,
          likes: data[index].likes,
        });
      }
      contentids.push(data[index].contentid);
    }

    const otherContent = await content
      .find({
        contentid: { $nin: [...contentids] },
      })
      .sort({ published_date: -1 });
    for (let index = 0; index < otherContent.length; index++) {
      mostLikedContent.push({
        contentData: otherContent[index],
        reads: 0,
        likes: 0,
      });
    }
    res.send({
      ok: true,
      data: mostLikedContent,
    });
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      error: error,
    });
  }
});

// most read content
app.get("/content/mostread", async (req, res) => {
  const content = db.model("content", contentSchema);
  const interactions = interactiondb.model("interactions", interactionSchema);

  try {
    const data = await interactions.find({}).sort({ reads: -1 });
    var mostReadContent = [];
    var contentids = [];
    for (let index = 0; index < data.length; index++) {
      var contentData = await content.findOne({
        contentid: data[index].contentid,
      });
      if (contentData != null) {
        mostReadContent.push({
          contentData,
          reads: data[index].reads,
          likes: data[index].likes,
        });
        contentids.push(data[index].contentid);
      }

      const otherContent = await content
        .find({
          contentid: { $nin: [...contentids] },
        })
        .sort({ published_date: -1 });

      for (let index = 0; index < otherContent.length; index++) {
        mostReadContent.push({
          contentData: otherContent[index],
          reads: 0,
          likes: 0,
        });
      }
      res.send({
        ok: true,
        data: mostReadContent,
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

app.listen(PORT, () => {
  console.log(`served started at port ${PORT}`);
});
