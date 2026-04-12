import Tag from "../models/Tag.js";
import Task from "../models/Task.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /tags - get all tags with task count
export const getTags = async (req, res) => {
  try {
    // Get all tags for user
    const tags = await Tag.find({ userId: req.userId }).sort({ name: 1 });

    // Count tasks per tag
    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const taskCount = await Task.countDocuments({
          userId: req.userId,
          tags: tag.name,
          deletedAt: null,
        });
        return {
          ...tag.toObject(),
          taskCount,
        };
      })
    );

    sendSuccess(res, tagsWithCount);
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /tags/:id - get a specific tag
export const getTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!tag) return sendError(res, "Tag not found", 404);
    sendSuccess(res, tag);
  } catch (err) {
    sendError(res, err.message);
  }
};

// POST /tags - create new tag
export const createTag = async (req, res) => {
  try {
    const { name, color } = req.body;

    // Check if tag already exists
    const existingTag = await Tag.findOne({
      userId: req.userId,
      name: new RegExp(`^${name}$`, "i"), // case-insensitive
    });

    if (existingTag) {
      return sendError(res, "Tag already exists", 409);
    }

    const tag = await Tag.create({
      userId: req.userId,
      name,
      color: color || "#3B5BDB",
    });

    sendSuccess(res, tag, "Tag created", 201);
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, "Tag already exists", 409);
    }
    sendError(res, err.message);
  }
};

// DELETE /tags/:id - delete tag (removes from all tasks)
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!tag) return sendError(res, "Tag not found", 404);

    // Remove tag from all tasks
    await Task.updateMany(
      { userId: req.userId, tags: tag.name },
      { $pull: { tags: tag.name } }
    );

    // Delete the tag itself
    await tag.deleteOne();
    sendSuccess(res, null, "Tag deleted");
  } catch (err) {
    sendError(res, err.message);
  }
};
