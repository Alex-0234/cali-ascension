import { ALL_EXERCISES, EXERCISE_DB } from "../data/exercise_db";

export const getHighestUnlockedExercises = (userProgress) => {
    
    if (!userProgress) return {};
    
    const highestExercises = {};

    Object.keys(ALL_EXERCISES).forEach(category => {
        const categoryExerciseIDs = ALL_EXERCISES[category];
        
        let topExercise = null;
        let highestTier = -1;

        categoryExerciseIDs.forEach(exerciseID => {
            const playerStats = userProgress[exerciseID];
            const gameRules = EXERCISE_DB[exerciseID];

            if (playerStats && playerStats.unlocked) {
                if (gameRules.tier > highestTier) {
                    highestTier = gameRules.tier;
                    
                    topExercise = {
                        ...gameRules,      // id, name, tier, animation
                        ...playerStats     // unlocked, proficiency, accumulatedXp
                    };
                }
            }
        });

        if (topExercise) {
            highestExercises[category] = topExercise;
        }
    });

    return highestExercises;
};

export function getPrevNextExerciseID(category, exerciseID) {
    const exercisesInTheCategory = ALL_EXERCISES[category]
    const index = exercisesInTheCategory.indexOf(exerciseID);

    return {
        prevID: exercisesInTheCategory[index - 1],
        nextID: exercisesInTheCategory[index + 1],
    }

}