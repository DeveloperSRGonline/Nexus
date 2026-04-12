import Timer from '../models/Timer.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get all timers for user
// @route   GET /api/timers
// @access  Private
export const getTimers = async (req, res) => {
  try {
    const timers = await Timer.find({ userId: req.userId }).sort({ createdAt: -1 });
    sendSuccess(res, timers);
  } catch (error) {
    sendError(res, 'Failed to fetch timers', 500);
  }
};

// @desc    Get single timer
// @route   GET /api/timers/:id
// @access  Private
export const getTimerById = async (req, res) => {
  try {
    const timer = await Timer.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!timer) {
      return sendError(res, 'Timer not found', 404);
    }

    sendSuccess(res, timer);
  } catch (error) {
    sendError(res, 'Failed to fetch timer', 500);
  }
};

// @desc    Create new timer
// @route   POST /api/timers
// @access  Private
export const createTimer = async (req, res) => {
  try {
    const { name, emoji, mode, pomoDuration } = req.body;

    const timer = await Timer.create({
      userId: req.userId,
      name,
      emoji: emoji || '⏱️',
      mode: mode || 'pomo',
      pomoDuration: pomoDuration || 25,
    });

    sendSuccess(res, timer, 'Timer created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create timer', 500);
  }
};

// @desc    Update timer
// @route   PATCH /api/timers/:id
// @access  Private
export const updateTimer = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'emoji', 'mode', 'pomoDuration'];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const timer = await Timer.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!timer) {
      return sendError(res, 'Timer not found', 404);
    }

    Object.keys(updates).forEach((key) => {
      timer[key] = updates[key];
    });

    await timer.save();

    sendSuccess(res, timer, 'Timer updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update timer', 500);
  }
};

// @desc    Delete timer
// @route   DELETE /api/timers/:id
// @access  Private
export const deleteTimer = async (req, res) => {
  try {
    const timer = await Timer.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!timer) {
      return sendError(res, 'Timer not found', 404);
    }

    sendSuccess(res, null, 'Timer deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete timer', 500);
  }
};
