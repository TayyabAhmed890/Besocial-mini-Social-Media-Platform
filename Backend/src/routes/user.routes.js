const express = require('express');
const controllers = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const { globalLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

// Protected User Routes
router.get('/all', globalLimiter, authMiddleware.authUser, controllers.getAllUsers);
router.get('/followers', globalLimiter, authMiddleware.authUser, controllers.getFollowers);
router.get('/followings', globalLimiter, authMiddleware.authUser, controllers.getFollowing);
router.post('/follow/:id', globalLimiter, authMiddleware.authUser, controllers.toggleFollowUser);
router.delete('/delete_user', globalLimiter, authMiddleware.authUser, controllers.deleteUser);
router.get('/profile', globalLimiter, authMiddleware.authUser, controllers.getUserProfile);

module.exports = router;