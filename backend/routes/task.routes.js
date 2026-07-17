const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');

router.use(authMiddleware);

router.get('/', taskController.getAllTasks);
router.post('/', [
    check('title', 'Task title layout header required').notEmpty().trim(),
    check('priority', 'Priority field configuration value invalid').isIn(['low', 'medium', 'high']),
    check('category', 'Category target parameter missing').notEmpty().trim(),
    check('dueDate', 'Target completion timestamp must be valid ISO8601').isISO8601()
], validateMiddleware, taskController.createTask);

router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/status', [
    check('status', 'Status must be todo, in-progress, completed, or archived').isIn(['todo', 'in-progress', 'completed', 'archived'])
], validateMiddleware, taskController.patchStatus);

router.post('/:id/duplicate', taskController.duplicateTask);

module.exports = router;