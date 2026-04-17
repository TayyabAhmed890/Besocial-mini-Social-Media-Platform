const postModel = require('../models/post.model')
const uploadFile = require("../services/storage.service")

// create post

const createPost = async (req, res) => {
    try {
        const result = await uploadFile(req.file.buffer);
        const data = req.body;

        const post = await postModel.create({
            image: result.url,
            caption: data.caption,
            user: req.user.id,
        })
        res.status(201).json({ message: "Post Created!", post })
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: "Something Went Wrong!" })
    }

}

// get post

const getPost = async (req, res) => {
    try {
        const post = await postModel.find().populate('user','username');
        res.status(200).json({
            message: "Posts Fetched!",
            posts: post
        })
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: "Something Went Wrong get!" })
    }
}

// get post by id

const getPostbyID = async (req, res) => {

    try {
        const id = req.params.id;

        const post = await postModel.findOne({ _id: id, })
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" })
        }
        res.status(200).json({
            message: "Post Fetched!",
            post: post,
        })
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: "Something Went Wrong getid!" })
    }

}

// delete post

const deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postModel.findOneAndDelete({ _id: id });
        if (!post) return res.status(404).json({ message: "Post Not Found!" });
        res.status(200).json({ message: "Post Deleted Successfully!" })
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ message: "Something Went Wrong" })
    }

}

const myPost = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts = await postModel.find({
      user: req.user.id
    }).populate('user','username');

    res.status(200).json({
        message: "Post Found!",
        posts
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Not Found!"
    });
  }
};

const likePost = async (req,res) =>{
    try {
    const post = await postModel.findById(req.params.id);

    const userId = req.user.id;

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // ❌ unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // ✅ like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
      updatedLikes: post.likes
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in liking post",
      
    });
  }
}

module.exports = {
    createPost,
    getPost,
    getPostbyID,
    deletePost,
    myPost,
    likePost,
}