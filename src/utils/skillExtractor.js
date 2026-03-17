
const skillDatabase = [
  "react",
  "node",
  "express",
  "mongodb",
  "html",
  "css",
  "JavaScript",
  "tailwind",
  "bootstrap",
  "python",
  "java",
  "c++",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "github",
  "mysql",
  "typescript",
  "nextjs"
];

const extractSkill = (resumeText) =>{
    const text = resumeText.toLowerCase().replace(/\s+/g, " ");
    
    const foundSkill = skillDatabase.filter(skill =>{
        return text.includes(skill.toLowerCase());
    })
  return foundSkill;
}



module.exports = extractSkill;