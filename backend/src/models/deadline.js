const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  deadline_date: {
    type: Date,
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  type: {
    type: String,
    enum: ["exam", "assignment", "project", "quiz"],
    required: true
  }
});

module.exports = mongoose.model("Deadline", deadlineSchema);