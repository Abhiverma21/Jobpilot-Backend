const Job = require("../models/Job.js");
const Resume = require("../models/Resume.js");
const {calculateMatchScore, getMissingSkills } = require("../utils/matchScore.js");
const extractSkill = require("../utils/skillExtractor.js");

exports.addJob = async (req, res) => {
  try {
    const {jobDescription} = req.body;
    const extractedSkills = extractSkill(jobDescription);
    const job = await Job.create({
      ...req.body,
        skills : extractedSkills,
      user: req.user._id,
    });
    res.status(201).json({ message: "Job Created Successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error in creating job" });
  }
};

//get jobs
exports.getJob = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id });
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch the jobs" });
  }
};

//update job status
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Not Authorized" });
    }

    // Update all editable fields
    const allowedFields = [
      'status', 'applicationDate', 'interviewDate', 'followUpDate', 'notes'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Convert date fields to Date objects
        if (['applicationDate', 'interviewDate', 'followUpDate'].includes(field) && req.body[field]) {
          job[field] = new Date(req.body[field]);
        } else {
          job[field] = req.body[field];
        }
      }
    });

    await job.save();
    res.send(job);
  } catch (err) {
    res.status(500).json({ message: "There is some error in updating job" });
  }
};

//Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    await Job.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Job Deleted successffully" });
  } catch (err) {
    res.status(500).json({ message: "There is some error in deleting job" });
  }
};

//match score ka kaam
exports.calulateScore = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const resume = await Resume.findById(req.body.resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const score = calculateMatchScore(job.skills, resume.resumeText);
    const missingSkills = getMissingSkills(job.skills , resume.skills);
    job.matchScore = score;
    job.resumeUsed = resume._id;

    await job.save();
    res.json({
      message: "Match score calculated",
      matchScore: score,
      missing : missingSkills
    });
  } catch (err) {
    res.status(500).json({ message: "Match calculation failed" });
  }
};
