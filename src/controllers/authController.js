const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.registerUser = async(req,res) => {
    try{
    const {username , email , password} = req.body;

    const existedUser = await User.findOne({email});
    if(existedUser){
        return res.status(400).json({message : "User Already Exists"})
    }

    const hashedPassword = await bcrypt.hash(password , 10);
    const newUser = await User.create({
        username,
        email,
        password : hashedPassword
    })
        const token = jwt.sign(
            {id : newUser._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        res.status(201).json({
            _id:newUser._id,
            username:newUser.username,
            email : newUser.email,
            token
        })
    }catch(err){
        console.log(err);
        res.send("Server Error");
    }
}

exports.loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const existedUser = await User.findOne({email});
        if(!existedUser){
            return res.status(400).json({message:"User not exists"})
        }
        const isMatch = await bcrypt.compare(password , existedUser.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }
            const token = jwt.sign(
      { id: existedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      _id: existedUser._id,
      username: existedUser.username,
      email: existedUser.email,
      token
    });
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server Error"})
    }
}

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};