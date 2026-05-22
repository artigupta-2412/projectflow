const { asyncHandler, sendSuccess } = require('../utils/response');
const taskService = require('../services/task.service');

const create = asyncHandler(async (req, res) => {
  const task = await taskService.createTask({ ...req.body, userId: req.user.id });
  sendSuccess(res, task, 'Task created', 201);
});

const getAll = asyncHandler(async (req, res) => {
  const { status, priority, projectId, search } = req.query;
  const tasks = await taskService.getTasks(req.user.id, req.user.role, { status, priority, projectId, search });
  sendSuccess(res, tasks, 'Tasks retrieved');
});

const getOne = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
  sendSuccess(res, task, 'Task retrieved');
});

const update = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user.id, req.user.role);
  sendSuccess(res, task, 'Task updated');
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await taskService.updateTaskStatus(req.params.id, status, req.user.id, req.user.role);
  sendSuccess(res, task, 'Task status updated');
});

const remove = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  sendSuccess(res, null, 'Task deleted');
});

module.exports = { create, getAll, getOne, update, updateStatus, remove };
