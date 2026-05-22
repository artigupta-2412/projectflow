const prisma = require('../utils/prisma');

const now = () => new Date();

const getDashboard = async (userId, role) => {
  if (role === 'ADMIN') {
    return getAdminDashboard();
  }
  return getMemberDashboard(userId);
};

const getAdminDashboard = async () => {
  const [
    totalProjects,
    totalTasks,
    doneTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    recentProjects,
    teamStats,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'DONE' } }),
    prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { status: 'TODO' } }),
    prisma.task.count({
      where: {
        dueDate: { lt: now() },
        status: { not: 'DONE' },
      },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        _count: { select: { tasks: true, members: true } },
      },
    }),
    // Team progress per member
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        tasksAssigned: {
          select: { status: true },
        },
      },
    }),
  ]);

  const teamProgress = teamStats.map(user => ({
    id: user.id,
    name: user.name,
    role: user.role,
    total: user.tasksAssigned.length,
    done: user.tasksAssigned.filter(t => t.status === 'DONE').length,
    inProgress: user.tasksAssigned.filter(t => t.status === 'IN_PROGRESS').length,
    todo: user.tasksAssigned.filter(t => t.status === 'TODO').length,
  }));

  return {
    stats: {
      totalProjects,
      totalTasks,
      doneTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
    },
    recentProjects,
    teamProgress,
  };
};

const getMemberDashboard = async (userId) => {
  const [
    assignedTasks,
    doneTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    upcomingTasks,
    myProjects,
  ] = await Promise.all([
    prisma.task.count({ where: { assignedToId: userId } }),
    prisma.task.count({ where: { assignedToId: userId, status: 'DONE' } }),
    prisma.task.count({ where: { assignedToId: userId, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { assignedToId: userId, status: 'TODO' } }),
    prisma.task.count({
      where: {
        assignedToId: userId,
        dueDate: { lt: now() },
        status: { not: 'DONE' },
      },
    }),
    // Tasks due in next 7 days
    prisma.task.findMany({
      where: {
        assignedToId: userId,
        status: { not: 'DONE' },
        dueDate: {
          gte: now(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        project: { select: { id: true, title: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
    }),
    prisma.projectMember.findMany({
      where: { userId },
      select: {
        project: {
          select: {
            id: true,
            title: true,
            _count: { select: { tasks: true } },
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      assignedTasks,
      doneTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      completionRate: assignedTasks > 0 ? Math.round((doneTasks / assignedTasks) * 100) : 0,
    },
    upcomingTasks,
    myProjects: myProjects.map(pm => pm.project),
  };
};

module.exports = { getDashboard };
