const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/project.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createProjectValidation, updateProjectValidation, addMemberValidation } = require('../validations/project.validation');

// All routes require authentication
router.use(authenticate);

router.post('/', authorize('ADMIN'), createProjectValidation, validate, ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.put('/:id', authorize('ADMIN'), updateProjectValidation, validate, ctrl.update);
router.delete('/:id', authorize('ADMIN'), ctrl.remove);

// Member management
router.post('/:id/members', authorize('ADMIN'), addMemberValidation, validate, ctrl.addMember);
router.delete('/:id/members/:memberId', authorize('ADMIN'), ctrl.removeMember);
router.get('/:id/members', ctrl.getMembers);

module.exports = router;
