const prisma = require('../utils/prisma');

const projectSelect = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  createdBy: { select: { id: true, name: true, email: true } },
  members: {
    select: {
      id: true,
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  },
  _count: { select: { tasks: true } },
};

const createProject = async ({ title, description, userId }) => {
  const project = await prisma.project.create({
    data: {
      title,
      description,
      createdById: userId,
      members: { create: { userId } }, // Creator is auto-added as member
    },
    select: projectSelect,
  });
  return project;
};

const getProjects = async (userId, role) => {
  // Admins see all projects; members only see their projects
  const where = role === 'ADMIN' ? {} : {
    members: { some: { userId } },
  };

  return prisma.project.findMany({
    where,
    select: projectSelect,
    orderBy: { createdAt: 'desc' },
  });
};

const getProjectById = async (projectId, userId, role) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ...projectSelect,
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          assignedTo: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  // Check access for members
  if (role !== 'ADMIN') {
    const isMember = project.members.some(m => m.user.id === userId);
    if (!isMember) {
      const error = new Error('Access denied. You are not a member of this project.');
      error.statusCode = 403;
      throw error;
    }
  }

  return project;
};

const updateProject = async (projectId, { title, description }) => {
  return prisma.project.update({
    where: { id: projectId },
    data: { title, description },
    select: projectSelect,
  });
};

const deleteProject = async (projectId) => {
  return prisma.project.delete({ where: { id: projectId } });
};

const addMember = async (projectId, userId) => {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if already a member
  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (existing) {
    const error = new Error('User is already a member of this project');
    error.statusCode = 409;
    throw error;
  }

  return prisma.projectMember.create({
    data: { projectId, userId },
    select: {
      id: true,
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
};

const removeMember = async (projectId, memberId) => {
  const member = await prisma.projectMember.findUnique({
    where: { id: memberId },
    include: { project: true },
  });

  if (!member || member.projectId !== projectId) {
    const error = new Error('Member not found in this project');
    error.statusCode = 404;
    throw error;
  }

  // Cannot remove the project creator
  if (member.userId === member.project.createdById) {
    const error = new Error('Cannot remove the project creator');
    error.statusCode = 400;
    throw error;
  }

  return prisma.projectMember.delete({ where: { id: memberId } });
};

const getProjectMembers = async (projectId) => {
  return prisma.projectMember.findMany({
    where: { projectId },
    select: {
      id: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
};

module.exports = {
  createProject, getProjects, getProjectById,
  updateProject, deleteProject, addMember, removeMember, getProjectMembers,
};
