const Resume = require("../models/Resume.js");
const pdfParse = require("pdf-parse");
const calculateMatchScore = require("../utils/matchScore.js");
const extractSkill = require("../utils/skillExtractor.js");

exports.uploadResume = async(req,res)=>{
    try{
        const pdfData =  await pdfParse(req.file.buffer);

        const text = pdfData.text;

        const skill = extractSkill(text);
        const resume = await Resume.findOneAndUpdate(
            { user: req.user._id },
            {
                fileName: req.file.originalname,
                resumeText: text,
                skills: skill
            },
            { upsert: true, new: true }
        );
        // const score = calculateMatchScore(jobskills , text);
        // console.log(score);
         res.status(201).json(resume);

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Error in uploading resume"})
    }
}

exports.getResume = async(req,res)=>{
    try{
        const resume = await Resume.findOne({user: req.user._id});
        if(!resume){
            return res.status(404).json({message: "No resume found"});
        }
        res.status(200).json(resume);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Error in fetching resume"});
    }
}

exports.deleteResume = async(req,res)=>{
    try{
        const resume = await Resume.findOneAndDelete({user: req.user._id});
        if(!resume){
            return res.status(404).json({message: "No resume found to delete"});
        }
        res.status(200).json({message: "Resume deleted successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Error in deleting resume"});
    }
}

