const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
   professor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  student_ids: [{  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'}]
});

module.exports = mongoose.model("Course", courseSchema);
