const express = require('express');
const controllers = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const { globalLimiter, authLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

// Sensitive Public Routes (Strict Limiter)
router.post('/register', authLimiter, controllers.registerUser);
router.post('/login', authLimiter, controllers.loginUser);

// Protected Auth Routes (Global Limiter)
router.post('/logout', globalLimiter, authMiddleware.authUser, controllers.logoutUser);
router.get('/me', globalLimiter, authMiddleware.authUser, controllers.checkUserisLoggin);

module.exports = router;