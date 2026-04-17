const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    image: String,
    caption: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
})

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;