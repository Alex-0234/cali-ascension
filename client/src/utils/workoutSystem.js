import { EXERCISE_DB } from "../data/exercise_db";

export function processWorkoutSession(currentProgress, currentWorkoutSession) {

    const newProgress = JSON.parse(JSON.stringify(currentProgress));

    currentWorkoutSession.forEach(loggedExercise => {
        const { exerciseID, totalReps } = loggedExercise;
        
        const exerciseData = EXERCISE_DB[exerciseID];
        if (!exerciseData) return;

        const highestTier = exerciseData.tier;

        function processRepCascade(currentExID) {
            const currentExData = EXERCISE_DB[currentExID];
            if (!currentExData || !newProgress[currentExID]) return;

            const currentTier = currentExData.tier;
            const multiplier = Math.max(1, highestTier - currentTier + 1);
            const cascadedReps = totalReps * multiplier;

            const currentTotal = newProgress[currentExID].totalReps || 0;
            newProgress[currentExID].totalReps = currentTotal + cascadedReps;

            if (currentExID === exerciseID) {
                const currentPB = newProgress[currentExID].personalBest || 0;
                if (totalReps > currentPB) {
                    newProgress[currentExID].personalBest = totalReps;
                }
            }

            if (currentExData.prerequisites && currentExData.prerequisites.length > 0) {
                currentExData.prerequisites.forEach(prereqID => {
                    processRepCascade(prereqID);
                });
            }
        }

        processRepCascade(exerciseID);
    });

    return newProgress;
}