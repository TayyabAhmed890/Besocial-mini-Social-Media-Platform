const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();

const mongo_db = process.env.MONGO_DB_URI;

const connectDB = async () =>{
    try {
        await mongoose.connect(mongo_db);
        console.log("MongoDB Connected!")
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

module.exports = connectDB;