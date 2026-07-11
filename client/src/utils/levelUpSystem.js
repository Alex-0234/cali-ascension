import { EXERCISE_DB } from "../data/exercise_db";
import { TIER_XP_REWARDS } from "../data/rewardMap";

const MAX_LEVEL = 100;
const PRESTIGE_SCALING = 1.25; 

export default function calculateLevel(userData) {
    /** @type {Object<string, Object>} */
    const workoutHistory = userData.workoutHistory || {};
    const prestige = userData.prestige || 0;
    const prestigeXPConsumed = userData.prestigeXPConsumed || 0;

    let totalXP = 0;

    const standardWeight = userData.gender === 'female' ? 65 : 80;
    if (Object.keys(workoutHistory).length < 1) return {
        level: 0,
        currentLeftoverXP: 0,
        totalXPEarned: 0
    };

    Object.keys(workoutHistory).forEach(day => {
        if (workoutHistory[day].status === 'workout') {
            Object.keys(workoutHistory[day].exercises).forEach(exercise => {
                const exerciseData = EXERCISE_DB[exercise];
                if (!exerciseData) return;
                const baseXP = TIER_XP_REWARDS[exerciseData.tier];
                const currentWorkoutSets = userData.workoutHistory[day].exercises[exercise].sets;
                if (currentWorkoutSets && Array.isArray(currentWorkoutSets)) {
                    currentWorkoutSets.forEach(set => {
                        const reps = Number(set.reps) || 0;
                        const extraWeight = Number(set.extraWeight) || 0;
                        let setMultiplier = 1;
                        if (extraWeight > 0) {
                            setMultiplier = 1 + (extraWeight / standardWeight);
                        }
                        totalXP += (baseXP * reps) * setMultiplier;
                    });
                }
            });
        }
    });

    const effectiveXP = Math.max(0, totalXP - prestigeXPConsumed);

    let tempLevel = 0;
    let currentXP = effectiveXP;

    while (tempLevel < MAX_LEVEL && currentXP >= getXpNeededForLevel(tempLevel, prestige)) {
        currentXP -= getXpNeededForLevel(tempLevel, prestige);
        tempLevel += 1;
    }

    return {
        level: tempLevel,
        currentLeftoverXP: currentXP,
        totalXPEarned: totalXP 
    };
}

export function getXpNeededForLevel(lvl, prestige = 0) {
    const BASE_XP_NEEDED = 10;
    const multiplier = Math.pow(PRESTIGE_SCALING, prestige);
    return (BASE_XP_NEEDED + ((BASE_XP_NEEDED * 1.5) * lvl)) * multiplier;
}

export function getLevelProgress(currentXP, userLevel, prestige = 0) {
    if (userLevel >= MAX_LEVEL) return 100;
    const neededXP = getXpNeededForLevel(userLevel, prestige);
    if (currentXP >= neededXP) return 100;
    return (currentXP / neededXP) * 100;
}

export function canPrestige(userData) {
    const { level } = calculateLevel(userData);
    return level >= MAX_LEVEL;
}


export function prestigeUser(userData) {
    const { level, totalXPEarned } = calculateLevel(userData);
    if (level < MAX_LEVEL) return userData;

    return {
        ...userData,
        prestige: (userData.prestige || 0) + 1,
        prestigeXPConsumed: totalXPEarned, 
        level: 0,
        xp: 0
    };
}