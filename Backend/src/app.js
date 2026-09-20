const express = require('express');
const postRoutes = require('./routes/post.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

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
        // Postman / Mobile / Same-origin ya allowed origin ko permit karein
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

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
    res.send("Mini Social Media Backend!");
});

module.exports = app;