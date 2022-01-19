const mongoose = require("mongoose");
const interactionSchema = new mongoose.Schema({
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

module.exports = { interactionSchema };
