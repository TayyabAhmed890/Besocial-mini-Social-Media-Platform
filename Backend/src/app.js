const express = require('express')
const postRoutes = require('./routes/post.routes')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"https://besocial-platform.vercel.app",
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser());

app.use('/api/posts',postRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)


app.get("/", (req, res) => {
    res.send("Mini Social Media Backend!");
})


module.exports = app;