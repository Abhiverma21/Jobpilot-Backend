const express = require("express");
const {addJob, getJob, updateJob, deleteJob, calulateScore} = require("../controllers/jobContoller.js");
const protect = require("../middleware/authMiddleware.js");


const router = express.Router();

router.post("/addjob" , protect , addJob);
router.get("/getjobs" , protect , getJob);
router.put("/:id/updatejob" , protect , updateJob);
router.delete("/:id/deletejob" , protect , deleteJob);
router.post("/:id/match" , protect , calulateScore)

module.exports = router;