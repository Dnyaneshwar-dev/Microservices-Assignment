require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { interactionSchema } = require("./schema/interactions");

const db = mongoose.createConnection(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

// Like event by user
app.post("/content/like", async (req, res) => {
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

app.post("/content/read", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server Started at port ${PORT}`);
});
