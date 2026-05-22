const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/task.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createTaskValidation, updateTaskValidation, updateStatusValidation } = require('../validations/task.validation');

router.use(authenticate);

router.post('/', authorize('ADMIN'), createTaskValidation, validate, ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.put('/:id', updateTaskValidation, validate, ctrl.update);
router.patch('/:id/status', updateStatusValidation, validate, ctrl.updateStatus);
router.delete('/:id', authorize('ADMIN'), ctrl.remove);

module.exports = router;
