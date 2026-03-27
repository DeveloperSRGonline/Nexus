import Project from '../models/Project.js';
import Task    from '../models/Task.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    sendSuccess(res, projects);
  } catch (err) {
    sendError(res, err.message);
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return sendError(res, 'Project not found', 404);
    sendSuccess(res, project);
  } catch (err) {
    sendError(res, err.message);
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description, color, icon, startDate, dueDate, tags } = req.body;
    const project = await Project.create({
      userId: req.userId,
      name, description,
      color:     color     || '#a3e635',
      icon:      icon      || '📁',
      startDate: startDate || null,
      dueDate:   dueDate   || null,
      tags:      tags      || [],
    });
    sendSuccess(res, project, 'Project created', 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!project) return sendError(res, 'Project not found', 404);
    sendSuccess(res, project, 'Project updated');
  } catch (err) {
    sendError(res, err.message);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) return sendError(res, 'Project not found', 404);
    // Unlink tasks from this project
    await Task.updateMany({ projectId: req.params.id }, { $set: { projectId: null } });
    sendSuccess(res, null, 'Project deleted');
  } catch (err) {
    sendError(res, err.message);
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const projectId = req.params.id;
    const tasks = await Task.find({ userId: req.userId, projectId });

    const total     = tasks.length;
    const done      = tasks.filter((t) => t.status === 'done').length;
    const inProgress= tasks.filter((t) => t.status === 'in_progress').length;
    const todo      = tasks.filter((t) => t.status === 'todo').length;
    const overdue   = tasks.filter((t) =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;

    sendSuccess(res, {
      total, done, inProgress, todo, overdue,
      completionRate: total ? Math.round((done / total) * 100) : 0,
    });
  } catch (err) {
    sendError(res, err.message);
  }
};