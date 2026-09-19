// Database Models aur Packages
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


// ==========================================
// 1. REGISTER USER CONTROLLER
// ==========================================
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Email Validation (Starts with letter & ends with @gmail.com)
        const emailRegex = /^[a-z][a-zA-Z0-9._%+-]*@gmail\.com$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: "Email must start with a small letter and end with @gmail.com"
            });
        }

        // Password Complexity Check
        const hasMinLength = password.length >= 6;
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
            return res.status(400).json({
                message: "Password must have 6+ chars, 1 uppercase, 1 number, and 1 special character."
            });
        }

        // Check Existing User
        const isUserExist = await userModel.findOne({
            $or: [{ username }, { email: cleanEmail }]
        });

        if (isUserExist) {
            return res.status(409).json({
                message: "Username or Email already exists!"
            });
        }

        // Hash Password & Save
        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email: cleanEmail,
            password: hash,
        });

        // JWT & Cookie
        const token = jwt.sign(
            { id: user._id, name: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User Created Successfully!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (err) {
        console.error(`Register Error: ${err}`);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};


// ==========================================
// 2. LOGIN USER CONTROLLER (FIXED)
// ==========================================
const loginUser = async (req, res) => {
    try {
        const { identifier, username, email, password } = req.body;
        const rawInput = (identifier || username || email)?.trim();

        if (!rawInput || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const cleanEmail = rawInput.toLowerCase();

        // MongoDB Query: Email ko lowercase se aur Username ko Case-Insensitive Regex se find karein
        const user = await userModel.findOne({
            $or: [
                { email: cleanEmail },
                { username: { $regex: new RegExp(`^${rawInput}$`, "i") } }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        const token = jwt.sign(
            { id: user._id, name: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User Logged In Successfully!",
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        console.error(`Login Error: ${err}`);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// ==========================================
// 3. LOGOUT USER CONTROLLER
// ==========================================
const logoutUser = async (req, res) => {
    try {
        const username = req.user?.name || "User";

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            message: `${username} Logged Out Successfully!`
        });
    } catch (err) {
        console.error(`Logout Error: ${err}`);
        return res.status(500).json({ message: "Something Went Wrong!" });
    }
};


// ==========================================
// 5. CHECK USER LOGGED-IN STATUS CONTROLLER
// ==========================================
const checkUserisLoggin = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    checkUserisLoggin,
};