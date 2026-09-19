const express = require('express');
const controllers = require('../controllers/post.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 1. Static & Specific GET Routes (Pehle Aayenge)
router.get('/', controllers.getPost);
router.get('/mypost', authMiddleware.authUser, controllers.myPost); // ✅ Move this ABOVE /:id

// 2. Dynamic GET Routes (Baad Mein Aayenge)
router.get('/:id', controllers.getPostbyID);

// 3. Other Protected Routes
router.post('/create', authMiddleware.authUser, upload.single("image"), controllers.createPost);
router.post('/like/:id', authMiddleware.authUser, controllers.likePost);
router.delete('/:id', authMiddleware.authUser, controllers.deletePost);

module.exports = router;