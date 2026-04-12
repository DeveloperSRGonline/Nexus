import Template from "../models/Template.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /api/templates - get all templates for user
export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    sendSuccess(res, templates);
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /api/templates/:id - get single template
export const getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!template) return sendError(res, "Template not found", 404);
    sendSuccess(res, template);
  } catch (err) {
    sendError(res, err.message);
  }
};

// POST /api/templates - create new template
export const createTemplate = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      priority,
      listId,
      tags,
      subtasks,
    } = req.body;

    const template = await Template.create({
      userId: req.userId,
      name: name || title,
      title,
      description: description || "",
      priority: priority || 4,
      listId: listId || null,
      tags: tags || [],
      subtasks: subtasks || [],
    });

    sendSuccess(res, template, "Template created", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /api/templates/:id - update template
export const updateTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!template) return sendError(res, "Template not found", 404);

    const allowedFields = [
      "name",
      "title",
      "description",
      "priority",
      "listId",
      "tags",
      "subtasks",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        template[field] = req.body[field];
      }
    });

    await template.save();
    sendSuccess(res, template, "Template updated");
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /api/templates/:id - delete template
export const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!template) return sendError(res, "Template not found", 404);
    sendSuccess(res, null, "Template deleted");
  } catch (err) {
    sendError(res, err.message);
  }
};
