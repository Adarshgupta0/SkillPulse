const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  quiz: {
    type: String,
    required: true,
    trim: true
  },
  quizCategory: {
    type: String,
    enum: ['AI/ML', 'Data science', 'Web development', 'Programming language', 'DSA'],
    required: true
  },

  options: [
    {
      _id: false,
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400  
  }
});

// Validate that exactly 4 options are given
quizSchema.path('options').validate(function (value) {
  return value.length === 4;
}, 'Exactly 4 options are required.');

const quizmodel = mongoose.model("Quiz", quizSchema);

module.exports = quizmodel;


