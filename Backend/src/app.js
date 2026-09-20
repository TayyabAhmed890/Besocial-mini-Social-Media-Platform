const express = require('express');
const postRoutes = require('./routes/post.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./db/connect'); // Connect DB import karein
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);

// .env se URL lene ke sath trailing slash ko strip karna
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";

const allowedOrigins = [
    clientUrl,
    "http://localhost:5173"
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy violation"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(cookieParser());

// Serverless DB Connection Middleware (Routes se pehle mandatory hai)
app.use(async (req, res, next) => {
    try {
        await db();
        next();
    } catch (err) {
        console.error("DB Connection Failed inside Middleware:", err.message);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
    res.send("Mini Social Media Backend!");
});

module.exports = app;