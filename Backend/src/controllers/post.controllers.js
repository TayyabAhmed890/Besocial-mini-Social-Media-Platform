// Database Model aur Storage Service ko import kar rahe hain
const postModel = require('../models/post.model');
const { uploadFile, deleteFile } = require("../services/storage.service");
const mongoose = require("mongoose");
const redis = require('../config/redis'); // Redis instance

// ==========================================
// 1. CREATE POST CONTROLLER
// ==========================================
const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required!" });
        }

        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized request!" });
        }

        const result = await uploadFile(req.file.buffer);
        const { caption } = req.body;

        const post = await postModel.create({
            image: result.url,
            fileId: result.fileId,
            caption: caption || "",
            user: userId,
        });

        // 🔥 Cache Invalidation: Purana feed cache delete karein taake naya post show ho
        await redis.del("feed_posts");

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
        const cacheKey = "feed_posts";

        // 1. Redis Cache Check Karein
        const cachedPosts = await redis.get(cacheKey);

        if (cachedPosts) {
            console.log("⚡ [CACHE HIT] Posts fetched from Upstash Redis");
            return res.status(200).json({
                message: "Posts Fetched Successfully (Cached)!",
                posts: cachedPosts,
                source: "cache"
            });
        }

        // 2. Cache Miss: Database Hit
        console.log("🗄️ [CACHE MISS] Fetching posts from MongoDB");
        const posts = await postModel.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        // 3. Data Ko Redis Mein 5 Minutes (300 seconds) Ke Liye Cache Karein
        await redis.set(cacheKey, JSON.stringify(posts), { ex: 300 });

        return res.status(200).json({
            message: "Posts Fetched Successfully!",
            posts,
            source: "db"
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Post ID format!" });
        }

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
        return res.status(500).json({ message: "Server Error!" });
    }
};

// ==========================================
// 4. DELETE POST CONTROLLER
// ==========================================
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Post ID format!" });
        }

        const userId = req.user?.id || req.user?._id;
        const post = await postModel.findOneAndDelete({ _id: id, user: userId });

        if (!post) {
            return res.status(404).json({ message: "Post Not Found or Unauthorized!" });
        }

        if (post.fileId) {
            await deleteFile(post.fileId);
        }

        // 🔥 Cache Invalidation: Delete hone par bhi feed cache reset karein
        await redis.del("feed_posts");

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
        const userId = req.user?.id || req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized Request" });
        }

        const posts = await postModel.find({ user: userId })
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
        const userId = req.user?.id || req.user?._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Post ID format!" });
        }

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found!"
            });
        }

        // Safe ObjectId vs String Comparison
        const alreadyLiked = post.likes.some(likeId => likeId.toString() === userId.toString());

        if (alreadyLiked) {
            post.likes = post.likes.filter((likeId) => likeId.toString() !== userId.toString());
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