const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        
        // Debugging label add karke check karein kis URL se hit ho raha hai
        // console.log(`[AUTH] Hit URL: ${req.originalUrl} | Decoded:`, decoded);

        next();
    } catch (err) {
        console.error(`Auth Middleware Error: ${err.message}`);
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

module.exports = { authUser };