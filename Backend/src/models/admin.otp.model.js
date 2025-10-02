// models/otp.model.js

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // TTL: document auto-deleted after 10 min
  }
});

const otpmodel = mongoose.model("AdminOtp", otpSchema);

module.exports = otpmodel;
