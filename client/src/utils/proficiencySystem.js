
export const getProficiency = (totalReps) => {
    const level = getProficiencyLevel(totalReps);
    const progress = getProficiencyProgress(totalReps);

    return {currentLevel: level, currentProgress: progress};
}
export const getProficiencyLevel = (totalReps) => {
    const level = Math.floor(totalReps / 100);
    return Math.min(level, 10); 
};

export const getProficiencyProgress = (totalReps) => {
    // 1000 REPS === 10 PROFICIENCY
    if (totalReps >= 1000) return 100; 

    return (totalReps / 100) * 10; 
};

export default function getCompleteProficiencyForExercise(exerciseProgress, exerciseID) {
    console.log(exerciseProgress)
    console.log(exerciseID)
    const totalReps = exerciseProgress[exerciseID].totalReps;
    const level = getProficiencyLevel(totalReps);
    const progress = getProficiencyProgress(totalReps);

    return {level, progress}
}