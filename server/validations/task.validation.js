const { body, query } = require('express-validator');

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('projectId')
    .notEmpty().withMessage('Project ID is required'),

  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid task status'),

  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority level'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid due date format'),

  body('assignedToId')
    .optional()
    .isString(),
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }),

  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid due date format'),
];

const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status'),
];

module.exports = { createTaskValidation, updateTaskValidation, updateStatusValidation };
