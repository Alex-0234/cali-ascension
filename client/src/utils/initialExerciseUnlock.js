import { EXERCISE_DB } from "../data/exercise_db";

export const initialExerciseUnlock = (evaluationResults) => {
    const unlockedProgress = {};

    Object.keys(evaluationResults).forEach(category => {
        const achievedID = evaluationResults[category].variationID; 
        const maxReps = evaluationResults[category].maxReps;

        let continueDown = true;
        let tempID = achievedID;

        while (continueDown) {
            let prevIdArray = EXERCISE_DB[tempID].prerequisites;
            if (prevIdArray.length > 0) {
                prevIdArray.forEach(prevId => {

                    unlockedProgress[prevId] = {
                        totalReps: maxReps,
                        personalBest: maxReps,
                    };
                    tempID = prevId;  // Ignores, the id of the previous exercises in the array. Shouldnt matter for me.
                })
            }
            else {
                continueDown = false;
            }
        }
    });

    return unlockedProgress;
};