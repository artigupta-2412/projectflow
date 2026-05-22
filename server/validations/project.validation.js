const { body } = require('express-validator');

const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

const updateProjectValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Title must be 2-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }),
];

const addMemberValidation = [
  body('userId')
    .notEmpty().withMessage('User ID is required'),
];

module.exports = { createProjectValidation, updateProjectValidation, addMemberValidation };
