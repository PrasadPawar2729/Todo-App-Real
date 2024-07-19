const express = require('express');
const { taskmodel } = require('../model/taskmodel');


const taskRouter = express.Router();

taskRouter.get('/', async (req, res) => {
  const tasks = await taskmodel.find().populate('assignedUser', 'username');
  res.json(tasks);
});

taskRouter.post('/', async (req, res) => {
  const task = new taskmodel(req.body);
  await task.save();
  global.io.emit('taskCreated', task);
  res.status(201).json(task);
});

taskRouter.put('/:id', async (req, res) => {
  const task = await taskmodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  global.io.emit('taskUpdated', task);
  res.json(task);
});

taskRouter.delete('/:id', async (req, res) => {
  await taskmodel.findByIdAndDelete(req.params.id);
  global.io.emit('taskDeleted', req.params.id);
  res.status(204).send();
});

module.exports = {taskRouter};
