const jwt = require('jsonwebtoken')

const authUser = async (req,res,next)=>{
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message:"Unauthorized!"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        console.error(`Error: ${err}`)
        return res.status(401).json({
            message: "Unauthorized!"
        })
    }
}

module.exports = {
    authUser
}