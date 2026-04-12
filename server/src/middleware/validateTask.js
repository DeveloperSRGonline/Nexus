import { body, param, validationResult } from 'express-validator';

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validate create task payload
export const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 500 })
    .withMessage('Title must be 500 characters or less'),

  body('priority')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 4 })
    .withMessage('Priority must be between 1 and 4'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),

  body('dueTime')
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Due time must be in HH:MM format (24-hour)'),

  body('listId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('List ID must be a valid MongoDB ObjectId'),

  body('tags')
    .optional({ nullable: true })
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .isMongoId()
    .withMessage('Each tag must be a valid MongoDB ObjectId'),

  body('subtasks')
    .optional({ nullable: true })
    .isArray()
    .withMessage('Subtasks must be an array'),

  body('subtasks.*.title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Subtask title is required'),

  body('subtasks.*.isCompleted')
    .optional()
    .isBoolean()
    .withMessage('Subtask isCompleted must be a boolean'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be 5000 characters or less'),

  body('attachments')
    .optional({ nullable: true })
    .isArray()
    .withMessage('Attachments must be an array'),

  body('order')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('Order must be a number'),

  handleValidationErrors,
];

// Validate update task payload
export const validateUpdateTask = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Title must be 500 characters or less'),

  body('priority')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Priority must be between 1 and 4'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),

  body('dueTime')
    .optional({ nullable: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Due time must be in HH:MM format (24-hour)'),

  body('listId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('List ID must be a valid MongoDB ObjectId'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('subtasks')
    .optional()
    .isArray()
    .withMessage('Subtasks must be an array'),

  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),

  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be 5000 characters or less'),

  body('attachments')
    .optional()
    .isArray()
    .withMessage('Attachments must be an array'),

  body('order')
    .optional()
    .isNumeric()
    .withMessage('Order must be a number'),

  handleValidationErrors,
];

// Validate ObjectId parameter
export const validateTaskId = [
  param('id')
    .isMongoId()
    .withMessage('Task ID must be a valid MongoDB ObjectId'),
  handleValidationErrors,
];

// Validate status update (deprecated endpoint)
export const validateStatusUpdate = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['todo', 'in_progress', 'review', 'done'])
    .withMessage('Status must be one of: todo, in_progress, review, done'),
  handleValidationErrors,
];
