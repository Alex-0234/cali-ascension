import { ALL_EXERCISES, EXERCISE_DB } from "../data/exercise_db";
import { exerciseProgress } from "../store/usePlayerStore";

export const getHighestUnlockedExercises = (userProgress: Record<string, exerciseProgress>) => {
    
    if (!userProgress) return {};
    
    const highestExercises: Record<string, object> = {};

    Object.keys(ALL_EXERCISES).forEach(category => {
        const categoryExerciseIDs = ALL_EXERCISES[category];
        
        let topExercise: object | null = null;
        let highestTier: number = -1;

        for (const exerciseID of categoryExerciseIDs) {
            const userRecord = userProgress[exerciseID];
            const exerciseData = EXERCISE_DB[exerciseID];
            
            if (userRecord) {
                if (exerciseData.tier > highestTier) {
                    highestTier = exerciseData.tier;
                    
                    topExercise = {
                        ...exerciseData,      
                        ...userRecord     
                    };
                }
            }
        };

        if (topExercise) {
            highestExercises[category] = topExercise;
        }
    })

    return highestExercises;
};

export function getPrevNextExerciseID(category: string, exerciseID: string) {
    const exercisesInTheCategory = ALL_EXERCISES[category]
    const index = exercisesInTheCategory.indexOf(exerciseID);

    return {
        prevID: exercisesInTheCategory[index - 1],
        nextID: exercisesInTheCategory[index + 1],
    }

}