import { EXERCISE_DB } from "../data/exercise_db";

export function calculateProficiencyCascade(currentProgress, currentVariationID, maxReps) {
    let newProgress = JSON.parse(JSON.stringify(currentProgress));

    if (!currentVariationID || !maxReps) return newProgress;

    const highestTier = EXERCISE_DB[currentVariationID].tier;

    function processExercise(exerciseID) {
        const exerciseData = EXERCISE_DB[exerciseID];
        
        if (!exerciseData || !newProgress[exerciseID]) return;

        const currentTier = exerciseData.tier;
        const multiplier = Math.max(1, highestTier - currentTier + 1);
        const gainedProficiency = maxReps * multiplier;

        const currentProf = newProgress[exerciseID].proficiency || 0;
        newProgress[exerciseID].proficiency = Math.min(10000, currentProf + gainedProficiency);

        if (exerciseData.prerequisites && exerciseData.prerequisites.length > 0) {
            exerciseData.prerequisites.forEach(prereqID => {
                processExercise(prereqID); 
            });
        }
    }

    processExercise(currentVariationID);

    return newProgress; 
}

export const getProficiencyLevel = (rawProficiency) => {
    const level = Math.floor(rawProficiency / 1000);
    return Math.min(level, 10); 
};

export const getProficiencyProgress = (rawProficiency) => {
    if (rawProficiency >= 10000) return 100; 

    const currentLevelPoints = rawProficiency % 1000;

    return (currentLevelPoints / 1000) * 100; 
};