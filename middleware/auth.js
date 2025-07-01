const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        const token = req.headers["authorization"].replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token not found!"
            })
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            })
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Internal server error while verifying the token"
        })
    }
}