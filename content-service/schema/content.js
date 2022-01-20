const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const contentSchema = new mongoose.Schema({
  contentid: {
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  },
  published_date: {
    type: Date,
    required: true,
  },
  userid: {
    type: String,
    required: true,
    minlength: 1,
  },
  title: {
    type: String,
    minlength: [1, "Title couldn't be empty"],
  },

  story: {
    type: String,
    required: true,
    minlength: 1,
  },
});

module.exports = { contentSchema };
