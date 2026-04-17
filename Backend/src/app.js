const express = require('express')
const postRoutes = require('./routes/post.routes')
const authRoutes = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors({
    origin:"https://besocial-platform.vercel.app",
    credentials:true
}))
app.use(cookieParser());

app.use('/api/posts',postRoutes)
app.use('/api/auth',authRoutes)


app.get("/", (req, res) => {
    res.send("Mini Social Media Backend!");
})


module.exports = app;