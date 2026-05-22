const prisma = require('../utils/prisma');

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  project: { select: { id: true, title: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true } },
};

const createTask = async ({ title, description, status, priority, dueDate, projectId, assignedToId, userId }) => {
  // Verify project exists and user has access
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      assignedToId: assignedToId || null,
      createdById: userId,
    },
    select: taskSelect,
  });
};

const getTasks = async (userId, role, filters = {}) => {
  const { status, priority, projectId, search } = filters;

  const where = {};

  // Role-based filtering
  if (role !== 'ADMIN') {
    where.assignedToId = userId;
  }

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (projectId) where.projectId = projectId;
  if (search) {
    where.title = { contains: search, mode: 'insensitive' };
  }

  return prisma.task.findMany({
    where,
    select: taskSelect,
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
  });
};

const getTaskById = async (taskId, userId, role) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: taskSelect,
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (role !== 'ADMIN' && task.assignedTo?.id !== userId) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

const updateTask = async (taskId, data, userId, role) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // Members can only update status of their tasks
  if (role !== 'ADMIN') {
    if (task.assignedToId !== userId) {
      const error = new Error('Access denied. You can only update your assigned tasks.');
      error.statusCode = 403;
      throw error;
    }
    // Members can only change status
    data = { status: data.status };
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId || null;

  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
    select: taskSelect,
  });
};

const updateTaskStatus = async (taskId, status, userId, role) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (role !== 'ADMIN' && task.assignedToId !== userId) {
    const error = new Error('Access denied. You can only update your own task status.');
    error.statusCode = 403;
    throw error;
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status },
    select: taskSelect,
  });
};

const deleteTask = async (taskId) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return prisma.task.delete({ where: { id: taskId } });
};

module.exports = { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, deleteTask };
