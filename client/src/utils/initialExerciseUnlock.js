import { ALL_EXERCISES } from "../data/exercise_db";

export const initialExerciseUnlock = (evaluationResults) => {
    const unlockedProgress = {};

    Object.keys(evaluationResults).forEach(category => {
        const achievedID = evaluationResults[category].variationID; // např. 'pushup_02'
        const maxReps = evaluationResults[category].maxReps;

        const categoryPath = ALL_EXERCISES[category];

        const achievedIndex = categoryPath.indexOf(achievedID);

        if (achievedIndex !== -1) {
            for (let i = 0; i <= achievedIndex; i++) {
                const exerciseId = categoryPath[i];

                unlockedProgress[exerciseId] = {
                    unlocked: true,
                    totalReps: maxReps,
                    personalBest: maxReps,
                };
            }
        }
    });

    return unlockedProgress;
};