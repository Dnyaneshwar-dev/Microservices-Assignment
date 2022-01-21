require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { interactionSchema } = require("./schema/interactions");
const { checkAuth } = require("./middlewares/auth");

const db = mongoose.createConnection(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 6000;

// Like event by user
app.post("/content/like", checkAuth, async (req, res) => {
  const { contentid } = req.body;
  const interactions = db.model("interactions", interactionSchema);
  try {
    const update = await interactions.updateOne(
      { contentid: contentid },
      {
        $inc: { likes: 1 },
        $setOnInsert: { reads: 0 },
      },
      { upsert: true }
    );
    res.json({
      ok: true,
      message: "Like count updated successfully to content",
    });
  } catch (error) {
    res.json({
      ok: false,
      message: error.message,
    });
  }
});

app.post("/content/read", checkAuth, async (req, res) => {
  const { contentid } = req.body;
  const interactions = db.model("interactions", interactionSchema);
  try {
    const update = await interactions.updateOne(
      { contentid: contentid },
      {
        $inc: { reads: 1 },
        $setOnInsert: { likes: 0 },
      },
      { upsert: true }
    );
    res.json({
      ok: true,
      message: "Read count updated successfully to content",
    });
  } catch (error) {
    res.json({
      ok: false,
      message: "Read count updated successfully to content",
    });
  }
});

// most read content
app.get("/content/mostread", async (req, res) => {
  const interactions = db.model("interactions", interactionSchema);
  try {
    const data = await interactions.find({}, "contentid").sort({ reads: -1 });
    res.json({
      ok: true,
      message: "content added successfully",
      data: data,
    });
  } catch (error) {
    res.json({
      ok: false,
      message: error,
    });
  }
});

// most liked content
app.get("/content/mostliked", async (req, res) => {
  const { contentid } = req.body;
  const interactions = db.model("interactions", interactionSchema);
  try {
    const data = await interactions.find({}, "contentid").sort({ likes: -1 });
    res.json({
      ok: true,
      message: "content added successfully",
      data: data,
    });
  } catch (error) {
    res.json({
      ok: false,
      message: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Started at port ${PORT}`);
});
