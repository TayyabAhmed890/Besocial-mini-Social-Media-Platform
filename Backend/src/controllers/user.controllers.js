const userModel = require('../models/user.model');
const postModel = require('../models/post.model');
const { deleteFile } = require("../services/storage.service");
const bcrypt = require('bcryptjs');

// ==========================================
// 4. GET ALL USERS CONTROLLER
// ==========================================
const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.user?._id;

        const users = await userModel.find({ _id: { $ne: currentUserId } }).select("-password");

        const formattedUsers = users.map(user => {
            const isFollowing = currentUserId 
                ? user.followers.some(id => id.toString() === currentUserId.toString())
                : false;

            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                isFollowing
            };
        });

        return res.status(200).json({
            message: "Users Fetched Successfully",
            users: formattedUsers,
        });
    } catch (err) {
        console.error(`Get Users Error: ${err}`);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// ==========================================
// 5. TOGGLE FOLLOW USER CONTROLLER
// ==========================================
const toggleFollowUser = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.user?._id;
        const targetUserId = req.params.id;

        if (currentUserId.toString() === targetUserId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const currentUser = await userModel.findById(currentUserId);
        const targetUser = await userModel.findById(targetUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAlreadyFollowing = currentUser.following.includes(targetUserId);

        if (isAlreadyFollowing) {
            // UNFOLLOW LOGIC
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
        } else {
            // FOLLOW LOGIC
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({
            success: true,
            message: isAlreadyFollowing ? "Unfollowed successfully" : "Followed successfully",
            isFollowing: !isAlreadyFollowing
        });

    } catch (err) {
        console.error(`Toggle Follow Error: ${err}`);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// ==========================================
// 6. DELETE USER PROFILE (HARD DELETE)
// ==========================================
const deleteUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID not found in request" });
    }

    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: "Password confirmation is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password confirmation" });
    }

    const userPosts = await postModel.find({ user: userId });

    for (const post of userPosts) {
      const fileId = post.fileId || post.image?.fileId;
      
      if (fileId) {
        try {
          await deleteFile(fileId);
        } catch (imgErr) {
          console.error(`Failed to delete post image (${fileId}) from ImageKit:`, imgErr);
        }
      }
    }

    await postModel.deleteMany({ user: userId });

    await userModel.updateMany(
      { $or: [{ followers: userId }, { following: userId }] },
      { $pull: { followers: userId, following: userId } }
    );

    await userModel.findByIdAndDelete(userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Account, posts, and ImageKit media deleted successfully.",
    });

  } catch (err) {
    console.error(`Delete Profile Error: ${err}`);
    return res.status(500).json({ message: "Error deleting account profile" });
  }
};

// ==========================================
// 7. GET USER PROFILE DATA
// ==========================================
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const totalPosts = await postModel.countDocuments({ user: userId });
        const totalLikedPosts = await postModel.countDocuments({ likes: userId });

        return res.status(200).json({
            success: true,
            user,
            stats: {
                totalPosts,
                totalLikedPosts
            }
        });
    } catch (err) {
        console.error(`Profile Fetch Error: ${err}`);
        return res.status(500).json({ message: "Error fetching profile data" });
    }
};

// ==========================================
// 8. GET FOLLOWERS LIST (FIXED)
// ==========================================
const getFollowers = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findById(userId).populate(
      "followers",
      "username email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ users: user.followers || [] });
  } catch (error) {
    console.error(`Get Followers Error: ${error}`);
    return res.status(500).json({ message: "Error fetching followers" });
  }
};

// ==========================================
// 9. GET FOLLOWING LIST (FIXED)
// ==========================================
const getFollowing = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findById(userId).populate(
      "following",
      "username email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ users: user.following || [] });
  } catch (error) {
    console.error(`Get Following Error: ${error}`);
    return res.status(500).json({ message: "Error fetching following list" });
  }
};

module.exports = {
    getAllUsers,
    getUserProfile,
    deleteUser,
    toggleFollowUser,
    getFollowers,
    getFollowing
};