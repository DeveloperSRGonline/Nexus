import List from "../models/List.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /lists - get all lists for user
export const getLists = async (req, res) => {
  try {
    const lists = await List.find({ userId: req.userId })
      .sort({ sortOrder: 1, createdAt: 1 });
    sendSuccess(res, lists);
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /lists/:id - get a specific list
export const getList = async (req, res) => {
  try {
    const list = await List.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!list) return sendError(res, "List not found", 404);
    sendSuccess(res, list);
  } catch (err) {
    sendError(res, err.message);
  }
};

// POST /lists - create new list
export const createList = async (req, res) => {
  try {
    const { name, emoji, color, sortOrder } = req.body;

    const list = await List.create({
      userId: req.userId,
      name,
      emoji: emoji || "📋",
      color: color || "#3B5BDB",
      sortOrder: sortOrder || 0,
    });

    sendSuccess(res, list, "List created", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /lists/:id - update list
export const updateList = async (req, res) => {
  try {
    const list = await List.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!list) return sendError(res, "List not found", 404);

    const allowedFields = ["name", "emoji", "color", "sortOrder"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        list[field] = req.body[field];
      }
    });

    await list.save();
    sendSuccess(res, list, "List updated");
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /lists/:id - delete list (except system lists)
export const deleteList = async (req, res) => {
  try {
    const list = await List.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!list) return sendError(res, "List not found", 404);

    if (list.isSystem) {
      return sendError(res, "Cannot delete system list", 403);
    }

    await list.deleteOne();
    sendSuccess(res, null, "List deleted");
  } catch (err) {
    sendError(res, err.message);
  }
};

// POST /lists/seed - seed default lists for new users
export const seedDefaultLists = async (req, res) => {
  try {
    // Check if user already has lists
    const existingLists = await List.findOne({ userId: req.userId });
    if (existingLists) {
      return sendSuccess(res, existingLists, "Lists already exist");
    }

    const defaultLists = [
      { userId: req.userId, name: "Inbox", emoji: "📥", color: "#3B5BDB", isSystem: true, sortOrder: 0 },
      { userId: req.userId, name: "Work", emoji: "💼", color: "#FF9F0A", sortOrder: 1 },
      { userId: req.userId, name: "Personal", emoji: "🏠", color: "#30D15A", sortOrder: 2 },
      { userId: req.userId, name: "Learning", emoji: "📚", color: "#BF5AF2", sortOrder: 3 },
      { userId: req.userId, name: "Fitness", emoji: "💪", color: "#FF3B30", sortOrder: 4 },
    ];

    const lists = await List.insertMany(defaultLists);
    sendSuccess(res, lists, "Default lists created", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};
