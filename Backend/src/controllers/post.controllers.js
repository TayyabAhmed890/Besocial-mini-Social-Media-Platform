// Database Model aur Storage Service ko import kar rahe hain
const postModel = require('../models/post.model');
const { uploadFile, deleteFile } = require("../services/storage.service"); // 🔥 Destructuring fix
const mongoose = require("mongoose");

// ==========================================
// 1. CREATE POST CONTROLLER
// ==========================================
const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required!" });
        }

        // ImageKit par file upload kar rahe hain (result se fileId & url dono milenge)
        const result = await uploadFile(req.file.buffer);
        const { caption } = req.body;

        // Database me post document create kar rahe hain (🔥 fileId save karna zaroori hai)
        const post = await postModel.create({
            image: result.url,
            fileId: result.fileId, // 🔥 FIX: File ID delete ke liye save kar li
            caption: caption || "",
            user: req.user.id,
        });

        return res.status(201).json({
            message: "Post Created Successfully!",
            post
        });

    } catch (error) {
        console.error(`Create Post Error: ${error}`);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// ==========================================
// 2. GET ALL POSTS CONTROLLER (Feed)
// ==========================================
const getPost = async (req, res) => {
    try {
        const posts = await postModel.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Posts Fetched Successfully!",
            posts
        });

    } catch (error) {
        console.error(`Get Posts Error: ${error}`);
        return res.status(500).json({ message: "Failed to fetch posts!" });
    }
};

// ==========================================
// 3. GET SINGLE POST BY ID
// ==========================================
const getPostbyID = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await postModel.findById(id).populate('user', 'username');

        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        return res.status(200).json({
            message: "Post Fetched!",
            post
        });

    } catch (error) {
        console.error(`Get Post By ID Error: ${error}`);
        return res.status(500).json({ message: "Invalid Post ID or Server Error!" });
    }
};

// ==========================================
// 4. DELETE POST CONTROLLER
// ==========================================
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Post ID format!"
            });
        }

        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request!" });
        }

        const post = await postModel.findOneAndDelete({
            _id: id,
            user: userId
        });

        if (!post) {
            return res.status(404).json({
                message: "Post Not Found or Unauthorized to delete!"
            });
        }

        // 🔥 Debug Logs
        // console.log("Deleted Post Object from DB:", post);
        // console.log("File ID to delete from ImageKit:", post.fileId);

        // 🔥 ImageKit se image delete kar rahe hain using fileId
        if (post.fileId) {
            const deleteResult = await deleteFile(post.fileId);
            console.log("ImageKit Delete Response:", deleteResult);
        } else {
            console.log("⚠️ Warning: No fileId found on this post. ImageKit deletion skipped.");
        }

        return res.status(200).json({ message: "Post Deleted Successfully!" });

    } catch (error) {
        console.error(`Delete Post Error: ${error}`);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// ==========================================
// 5. GET LOGGED-IN USER'S POSTS (My Posts)
// ==========================================
const myPost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized Request" });
        }

        const posts = await postModel.find({ user: req.user.id })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "User Posts Found!",
            posts
        });

    } catch (err) {
        console.error(`My Posts Error: ${err}`);
        return res.status(500).json({ message: "Failed to load user posts!" });
    }
};

// ==========================================
// 6. LIKE / UNLIKE POST CONTROLLER
// ==========================================
const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found!"
            });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter((likeId) => likeId.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            likesCount: post.likes.length,
            isLiked: !alreadyLiked,
            updatedLikes: post.likes
        });

    } catch (err) {
        console.error(`Like Post Error: ${err}`);
        return res.status(500).json({
            success: false,
            message: "Error updating like status"
        });
    }
};

// Exporting Controllers
module.exports = {
    createPost,
    getPost,
    getPostbyID,
    deletePost,
    myPost,
    likePost,
};