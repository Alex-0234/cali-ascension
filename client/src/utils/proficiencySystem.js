
export const getProficiency = (totalReps) => {
    const rawProficiency = totalReps; 
    const level = getProficiencyLevel(rawProficiency);
    const progress = getProficiencyProgress(rawProficiency);

    return {currentLevel: level, currentProgress: progress};
}
export const getProficiencyLevel = (rawProficiency) => {
    const level = Math.floor(rawProficiency / 100);
    return Math.min(level, 10); 
};

export const getProficiencyProgress = (rawProficiency) => {
    // 1000 REPS === 10 PROFICIENCY
    if (rawProficiency >= 1000) return 100; 

    return (rawProficiency / 100) * 10; 
};