const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');

router.post('/register', [
    check('name', 'Name tracking attribute is strictly required').notEmpty().trim(),
    check('email', 'Provide a valid programmatic email address').isEmail().normalizeEmail(),
    check('password', 'Password security footprint requires min 8 characters').isLength({ min: 8 })
], validateMiddleware, authController.register);

router.post('/login', [
    check('email', 'Valid email required').isEmail().normalizeEmail(),
    check('password', 'Password validation string must not be empty').notEmpty()
], validateMiddleware, authController.login);

router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;