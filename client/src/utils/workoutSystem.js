import { EXERCISE_DB } from "../data/exercise_db";

export function saveWorkoutReps(currentProgress, currentVariationID, maxReps) {
    const newProgress = currentProgress;

    if (!currentProgress || !maxReps ) return newProgress;

    const highestTier = EXERCISE_DB[currentVariationID].tier;

    function processRepCascade(exerciseID) {
        const exerciseData = EXERCISE_DB[exerciseID];
        if (!exerciseData || !newProgress[exerciseID]) return;

        const currentTier = exerciseData.tier;
        const multiplier = Math.max(1, highestTier - currentTier + 1);
        const cascadedReps = maxReps * multiplier;

        const currentTotal = newProgress[exerciseID].totalReps || 0;
        newProgress[exerciseID].totalReps = currentTotal + cascadedReps;

        if (exerciseID === currentVariationID) {
            const currentPB = newProgress[exerciseID].personalBest || 0;
            if (maxReps > currentPB) {
                newProgress[exerciseID].personalBest = maxReps;
            }
        }

        if (exerciseData.prerequisites && exerciseData.prerequisites.length > 0) {
            exerciseData.prerequisites.forEach(prereqID => {
                processRepCascade(prereqID);
            });
        }
    }

    processRepCascade(currentVariationID);
    return newProgress;
}