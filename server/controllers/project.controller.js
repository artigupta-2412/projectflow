const { asyncHandler, sendSuccess, sendError } = require('../utils/response');
const projectService = require('../services/project.service');

const create = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const project = await projectService.createProject({ title, description, userId: req.user.id });
  sendSuccess(res, project, 'Project created', 201);
});

const getAll = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user.id, req.user.role);
  sendSuccess(res, projects, 'Projects retrieved');
});

const getOne = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id, req.user.id, req.user.role);
  sendSuccess(res, project, 'Project retrieved');
});

const update = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const project = await projectService.updateProject(req.params.id, { title, description });
  sendSuccess(res, project, 'Project updated');
});

const remove = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  sendSuccess(res, null, 'Project deleted');
});

const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const member = await projectService.addMember(req.params.id, userId);
  sendSuccess(res, member, 'Member added', 201);
});

const removeMember = asyncHandler(async (req, res) => {
  await projectService.removeMember(req.params.id, req.params.memberId);
  sendSuccess(res, null, 'Member removed');
});

const getMembers = asyncHandler(async (req, res) => {
  const members = await projectService.getProjectMembers(req.params.id);
  sendSuccess(res, members, 'Members retrieved');
});

module.exports = { create, getAll, getOne, update, remove, addMember, removeMember, getMembers };
