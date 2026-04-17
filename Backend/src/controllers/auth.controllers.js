const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()


const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields required" })
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Weak Password" })
        }

        const isUserExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isUserExist) {
            return res.status(409).json({
                message: "User Already Exist!"
            })
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
        })

        const token = jwt.sign({ id: user._id, name: user.username }, process.env.JWT_SECRET)

        res.cookie("token", token)

        res.status(201).json({
            message: "User Created Successfully!",
            user,
            token
        })
    }
    catch (err) {
        console.error(`Error: ${err}`)
        return res.status(500).json({
            message: "Something Went Wrong!"
        })
    }

}


const loginUser = async (req, res) => {
    try {
        const { identifier, username, email, password } = req.body;

        const loginField = identifier || username || email;

        const user = await userModel.findOne({
            $or: [
                { username: loginField },
                { email: loginField }
            ]
        })

        if (!loginField || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials!"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid Credentials!"
            })
        }

        const token = jwt.sign({ id: user._id, name: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 🔥 7 days
        })

        res.status(200).json({
            message: "User Login Successfully!",
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
            },
            token,
        })
    }
    catch (err) {
        console.error(`Error: ${err}`)
        return res.status(500).json({
            message: "Something Went Wrong!"
        })
    }
}


const logoutUser = async (req, res) => {
    try {
        const username = req.user.name
        res.clearCookie("token");
        res.status(200).json({
            message: `${username} Logout Successfully!`
        })
    } catch (err) {
        console.error(`Error: ${error}`);
        return res.status(500).json({
            message: "Something Went Wrong!"
        })
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({
            message: "Users Fetched Successfully",
            users,
        })
    }
    catch (err) {
        console.error(`Error: ${err}`)
        return res.status(500).json({
            message: "Something Went Wrong!"
        })
    }
}

const checkUserisLoggin = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    })
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    logoutUser,
    checkUserisLoggin
};