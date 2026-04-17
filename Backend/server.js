const app = require("./src/app")
const dotenv = require("dotenv")
const db = require("./src/db/connect");
dotenv.config();

const port = process.env.PORT;

// database connection
db();

app.listen(port,()=>{
    console.log(`Server is Running on http://localhost:${port}`)
})

