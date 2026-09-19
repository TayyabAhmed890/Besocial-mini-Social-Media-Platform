const express = require('express');
const controllers = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Protected Auth Routes
router.get('/all', authMiddleware.authUser, controllers.getAllUsers);
router.get('/followers', authMiddleware.authUser, controllers.getFollowers);
router.get('/followings', authMiddleware.authUser, controllers.getFollowing);
router.post('/follow/:id', authMiddleware.authUser, controllers.toggleFollowUser);
router.delete('/delete_user', authMiddleware.authUser, controllers.deleteUser);
router.get('/profile', authMiddleware.authUser, controllers.getUserProfile);

module.exports = router;