import FocusRecord from '../models/FocusRecord.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// @desc    Get overview stats (today pomos, today duration, total pomos, total duration)
// @route   GET /api/focus-records/overview
// @access  Private
export const getOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's stats
    const todayPomos = await FocusRecord.countDocuments({
      userId: req.userId,
      completedAt: { $gte: today, $lt: tomorrow },
    });

    const todayDurationAgg = await FocusRecord.aggregate([
      {
        $match: {
          userId: req.userId,
          completedAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' },
        },
      },
    ]);

    const todayDuration = todayDurationAgg.length > 0 ? todayDurationAgg[0].totalDuration : 0;

    // All-time stats
    const totalPomos = await FocusRecord.countDocuments({ userId: req.userId });

    const totalDurationAgg = await FocusRecord.aggregate([
      {
        $match: { userId: req.userId },
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' },
        },
      },
    ]);

    const totalDuration = totalDurationAgg.length > 0 ? totalDurationAgg[0].totalDuration : 0;

    sendSuccess(res, {
      todayPomos,
      todayDuration: Math.round(todayDuration / 60), // Convert to minutes
      totalPomos,
      totalDuration: Math.round(totalDuration / 60), // Convert to minutes
    });
  } catch (error) {
    sendError(res, 'Failed to fetch overview stats', 500);
  }
};

// @desc    Get all focus records for user
// @route   GET /api/focus-records
// @access  Private
export const getFocusRecords = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const records = await FocusRecord.find({ userId: req.userId })
      .populate('timerId', 'name emoji')
      .populate('linkedTaskId', 'title')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FocusRecord.countDocuments({ userId: req.userId });

    sendSuccess(res, {
      records,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    sendError(res, 'Failed to fetch focus records', 500);
  }
};

// @desc    Create focus record
// @route   POST /api/focus-records
// @access  Private
export const createFocusRecord = async (req, res) => {
  try {
    const { timerId, linkedTaskId, mode, duration, completedAt } = req.body;

    const record = await FocusRecord.create({
      userId: req.userId,
      timerId,
      linkedTaskId: linkedTaskId || null,
      mode,
      duration,
      completedAt: completedAt || new Date(),
    });

    sendSuccess(res, record, 'Focus record created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create focus record', 500);
  }
};

// @desc    Delete focus record
// @route   DELETE /api/focus-records/:id
// @access  Private
export const deleteFocusRecord = async (req, res) => {
  try {
    const record = await FocusRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!record) {
      return sendError(res, 'Focus record not found', 404);
    }

    sendSuccess(res, null, 'Focus record deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete focus record', 500);
  }
};
