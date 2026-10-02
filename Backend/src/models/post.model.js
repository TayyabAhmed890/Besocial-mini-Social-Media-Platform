const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    fileId: {
        type:String,
        required: true
    },
    
},{timestamps:true}); // Automatically adds createdAt and updatedAt fields

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;