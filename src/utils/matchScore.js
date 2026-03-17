exports.calculateMatchScore = (jobskills , resumeText) => {
    if(!jobskills || jobskills.length == 0) return 0
    const text = resumeText.toLowerCase();
    let matchCount = 0;

    jobskills.forEach(skill =>{
        if(text.includes(skill.toLowerCase())){
            matchCount++;
        }
    })

    const score = (matchCount / jobskills.length) * 100;
    return Math.round(score);
}


exports.getMissingSkills = (jobskills , resumeSkill)=>{
    if(!jobskills || !resumeSkill) return [];

    const missing = jobskills.filter(skill => 
        !resumeSkill.includes(skill)
    );

    return missing;
}