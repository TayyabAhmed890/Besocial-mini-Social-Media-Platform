const express = require('express');
const controllers = require('../controllers/post.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const { globalLimiter } = require('../middlewares/rateLimiter.middleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 1. Static & Specific GET Routes
router.get('/', globalLimiter, controllers.getPost);
router.get('/mypost', globalLimiter, authMiddleware.authUser, controllers.myPost);

// 2. Dynamic GET Routes
router.get('/:id', globalLimiter, controllers.getPostbyID);

// 3. Other Protected Routes
router.post('/create', globalLimiter, authMiddleware.authUser, upload.single("image"), controllers.createPost);
router.post('/like/:id', globalLimiter, authMiddleware.authUser, controllers.likePost);
router.delete('/:id', globalLimiter, authMiddleware.authUser, controllers.deletePost);

module.exports = router;