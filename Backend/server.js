const app = require("./src/app");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
});

module.exports = app; // Correct spelling with 's'