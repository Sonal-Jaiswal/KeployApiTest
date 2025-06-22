const Task = require('../models/Task');

const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description });
  await task.save();
  res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, completed },
    { new: true }
  );
  res.json(task);
};

const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ deleted: 1 });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}; 