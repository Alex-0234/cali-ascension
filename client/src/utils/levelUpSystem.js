import { EXERCISE_DB } from "../data/exercise_db";
import { TIER_XP_REWARDS } from "../data/rewardMap";

export default function calculateLevel(userData) {              
    const workoutHistory = userData.workoutHistory || [];
    let totalXP = 0;
    
    const standardWeight = userData.gender === 'female' ? 65 : 80;

    if (workoutHistory.length > 1) return;

/*     const sortedDates = Object.keys(workoutHistory).sort((a, b) => new Date(b) - new Date(a)); */

    Object.keys(workoutHistory).forEach(day => {
        console.log(day)

        if (workoutHistory[day].type === 'workout') {

            workoutHistory[day].exercises.forEach(exercise => {

                const exerciseData = EXERCISE_DB[exercise.exerciseID];
                if (!exerciseData) return;

                const baseXP = TIER_XP_REWARDS[exerciseData.tier];

                if (exercise.sets && Array.isArray(exercise.sets)) {
                    exercise.sets.forEach(set => {

                        const reps = Number(set.reps) || 0;
                        const extraWeight = Number(set.extraWeight) || 0;

                        let setMultiplier = 1;
                        if (extraWeight > 0) {
                            setMultiplier = 1 + (extraWeight / standardWeight);
                        }

                        totalXP += (baseXP * reps) * setMultiplier;
                    });
                }
                
            })
        }
    });

    let tempLevel = 0;
    let currentXP = totalXP;

    while (currentXP >= getXpNeededForLevel(tempLevel)) {
        currentXP -= getXpNeededForLevel(tempLevel);
        tempLevel += 1;
    }   

    return {
        level: Math.min(tempLevel, 100),
        currentLeftoverXP: Math.min(tempLevel, 100) < 100 ? currentXP : 0,
        totalXPEarned: totalXP
    };
}

export function getXpNeededForLevel(lvl) {
    const BASE_XP_NEEDED = 10;
    return BASE_XP_NEEDED + ((BASE_XP_NEEDED * 1.5) * lvl);
}

export function getLevelProgress(currentXP, userLevel) {
    if (userLevel === 100) return 100;
    const neededXP = getXpNeededForLevel(userLevel);
    if (currentXP >= neededXP) return 100;
    return (currentXP / neededXP) * 100;
}