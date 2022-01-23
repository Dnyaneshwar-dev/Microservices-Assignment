const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
  },
  phone: {
    type: String,
    required: true,
    minlength: 1,
  },
  password: {
    type: String,
    minlength: 4,
  },
});

module.exports = { userSchema };
