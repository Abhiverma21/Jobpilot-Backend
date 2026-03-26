const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db.js");
dotenv.config();
const PORT = process.env.PORT || 5000;
const authRoute = require("./routes/authRoute.js");
const jobRoute = require("./routes/jobRoute.js");
const resumeRoute = require("./routes/resumeRoute.js");
const protect = require("./middleware/authMiddleware.js");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.get("/", (req,res)=>{
    res.send("App is working")
})

//auth route api
app.use("/api/auth" , authRoute);

//Job route api 
app.use("/api/jobs" , jobRoute);

//upload resume api 
app.use("/api/resume" , resumeRoute);



//mongodb connection
connectDB();

//protected route testing
app.get("/api/protected" ,protect ,  (req,res)=>{
    res.json({
        message:"You are accesing private routes",
        user : req.user
    })
})
app.listen(PORT , ()=>{
    console.log("App is listening");
    
})

