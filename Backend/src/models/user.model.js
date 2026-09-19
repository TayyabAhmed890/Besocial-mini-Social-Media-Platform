const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
},{timestamps:true})

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;