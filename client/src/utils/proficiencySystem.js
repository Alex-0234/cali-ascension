
export const getProficiency = (totalReps) => {
    const level = getProficiencyLevel(totalReps);
    const progress = getProficiencyProgress(totalReps);

    return {currentLevel: level, currentProgress: progress};
}
export const getProficiencyLevel = (totalReps) => {
    const level = Math.floor(totalReps / 1000);
    return Math.min(level, 10); 
};

export const getProficiencyProgress = (totalReps) => {
    // 10000 REPS === 10 PROFICIENCY
    if (totalReps >= 10000) return 100; 

    return (totalReps / 10000) * 100; 
};

export default function getCompleteProficiencyForExercise(exerciseProgress, exerciseID) {
    console.log(exerciseProgress)
    console.log(exerciseID)
    if (exerciseProgress[exerciseID]) {
        const totalReps = exerciseProgress[exerciseID].totalReps;
        const level = getProficiencyLevel(totalReps);
        const progress = getProficiencyProgress(totalReps);
        return {level, progress}
    }
   return {level: 0, progress: 0}
}