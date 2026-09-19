const express = require('express');
const controllers = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public Auth Routes
router.post('/register', controllers.registerUser);
router.post('/login', controllers.loginUser);

// Protected Auth Routes
router.post('/logout', authMiddleware.authUser, controllers.logoutUser);
router.get('/me', authMiddleware.authUser, controllers.checkUserisLoggin);

module.exports = router;