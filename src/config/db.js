const mongoose = require("mongoose");

async function connectDB(){
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb is connected");
        
    }catch(err){
        console.log(err.message + "There is an error in mongodb connection");
        
    }
};


module.exports = connectDB;