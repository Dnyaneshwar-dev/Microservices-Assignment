const { PrismaClient } = require("@prisma/client");
const express = require("express");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/books/new", async (req, res) => {
  const { title, story, userid, published_date } = req.body;
  try {
    const data = await prisma.content.create({
      data: {
        title: title,
        story: story,
        published_date: published_date,
        userid: userid,
      },
    });
    res.json({
      ok: true,
      message: "Content created successfully",
    });
  } catch (error) {
    res.json({
      ok: false,
      message: "Something Went Wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log(`served started at port ${PORT}`);
});
