const express = require('express')
const controllers = require('../controllers/post.controllers')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()}); // use for handle files

router.get('/',controllers.getPost)
router.get('/mypost',authMiddleware.authUser,controllers.myPost)
router.get('/:id',controllers.getPostbyID)
router.post('/create',authMiddleware.authUser,upload.single("image"),controllers.createPost)
router.post("/like/:id", authMiddleware.authUser, controllers.likePost)
router.delete('/:id',controllers.deletePost)

module.exports = router