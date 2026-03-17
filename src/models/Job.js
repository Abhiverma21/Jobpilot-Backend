const mongoose = require("mongoose");

const jobSchema  = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    companyName:{
        type:String,
        required: true
    },
    role:{
        type : String,
        required:true
    },
    jobLink: String,
    jobDescription : {
        type : String,
        required : true
    },
    skills : [String],
    resumeUsed : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Resume"
    },
    matchScore : {
        type:Number,    
        default:0
    },
    status : {
        type: String,
        enum : ["Applied" , "Interview" , "Rejected" ,"Selected"],
        default : "Applied"
    },
    applicationDate : {
        type: Date,
        default: Date.now
    },
    interviewDate : Date,
    followUpDate : Date,
    timeline : [{
        status: String,
        date: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],
    notes : String
},
    {timestamps:true}
)

module.exports = mongoose.model("Job", jobSchema);