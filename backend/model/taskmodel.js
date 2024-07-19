const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['start', 'in progress', 'completed'], default: 'start' },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const taskmodel = mongoose.model("task",TaskSchema)

module.exports = {taskmodel};
