const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async(req,res,next) =>{
    let token;
    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(err){
            res.status(404).json({message:"Not Authorized"})
        }
    }
    if(!token){
        res.status(404).json({message:"No token provided"})
    }
}

module.exports = protect;