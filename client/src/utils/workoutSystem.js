import { ALL_EXERCISES, EXERCISE_DB } from "../data/exercise_db";

export function processWorkoutHistoryObject(workoutHistory) {
    let tempProgress = {};
    
    const safeWorkoutHistory = (workoutHistory && !Array.isArray(workoutHistory)) ? workoutHistory : {};

    if (ALL_EXERCISES) {
        Object.keys(ALL_EXERCISES).forEach(category => {
            const baseExerciseId = ALL_EXERCISES[category][0];
            if (baseExerciseId) {
                tempProgress[baseExerciseId] = { totalReps: 0, personalBest: 0 };
            }
        });
    }

    Object.keys(safeWorkoutHistory).forEach(day => {
        if (safeWorkoutHistory[day].status === 'workout') {
            Object.keys(safeWorkoutHistory[day].exercises).forEach((exerciseId, index) => {
                const { totalReps, sets } = safeWorkoutHistory[day].exercises[exerciseId]; 
                
                const exerciseData = EXERCISE_DB[exerciseId];
                if (!exerciseData) return;

                const highestTier = exerciseData.tier;

                function processRepCascade(currentExID) {

                    if (!tempProgress[currentExID]) {
                        tempProgress[currentExID] = { totalReps: 0, personalBest: 0 };
                    }

                    const currentExData = EXERCISE_DB[currentExID];
                    if (!currentExData) return;

                    const currentTier = currentExData.tier;
                    const multiplier = Math.max(1, highestTier - currentTier + 1);  
                    const cascadedReps = totalReps * multiplier;

                    tempProgress[currentExID].totalReps += cascadedReps;

                    if (currentExID === exerciseId && sets && sets.length > 0) {

                        const maxRepsInSet = Math.max(...sets.map(s => Number(s.reps) || 0));
                        const currentPB = tempProgress[currentExID].personalBest || 0;
                        
                        if (maxRepsInSet > currentPB) {
                            tempProgress[currentExID].personalBest = maxRepsInSet;
                        }
                    }

                    if (currentExData.prerequisites && currentExData.prerequisites.length > 0) {
                        currentExData.prerequisites.forEach(prereqID => {
                            processRepCascade(prereqID);
                        });
                    }
                }
                        
                processRepCascade(exerciseId);
            });
        }
    });

    return tempProgress;
}