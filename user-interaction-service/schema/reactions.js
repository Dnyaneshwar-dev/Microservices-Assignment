const mongoose = require("mongoose");
const reactionSchema = new mongoose.Schema({
  contentid: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
  },
  reads: {
    type: Number,
  },
});

module.exports = { reactionSchema };
