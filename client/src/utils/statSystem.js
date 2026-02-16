import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";

const EXERCISE_STAT_SCALING = {
    pushups: { STR: 1.0, VIT: 0.2, AGI: 0.1, DEX: 0.5 },
    squats:  { STR: 1.0, VIT: 0.2, AGI: 0.7, DEX: 0.5 },
    pullups: { STR: 1.0, VIT: 0.2, AGI: 0,   DEX: 0.5 },
    // etc.
};

const STATS_PER_TIER = 12;
const MAX_REPS_MASTERY = 5;

export function calculatePlayerStats(userProgress) {
    // 1. Založíme jeden HLAVNÍ objekt pro staty
    const Stats = {
        STR: 10,
        AGI: 10,
        VIT: 10,
        DEX: 10,
    };

    if (!userProgress) return { newStats: Stats };

    Object.keys(ALL_EXERCISES).forEach(category => {
        const currentStatScaling = EXERCISE_STAT_SCALING[category];
        
        if (!currentStatScaling) return;

        let highestTierUnlocked = -1;
        let tempMaxReps = 0;
        let tempStats = 0;

        ALL_EXERCISES[category].forEach(exerciseId => {
            const exerciseData = EXERCISE_DB[exerciseId];
            if (exerciseData && userProgress[exerciseId]) {
                const exerciseTier = exerciseData.tier;
                if (exerciseTier > highestTierUnlocked) {
                    highestTierUnlocked = exerciseTier;
                    tempMaxReps = userProgress[exerciseId].personalBest || 0; 
                }
            }
        });

        if (highestTierUnlocked >= 0) {
            const baseTierPoints = highestTierUnlocked * STATS_PER_TIER;
            
            const cappedReps = Math.min(tempMaxReps, 12);
            const repBonusPoints = (cappedReps / 12) * MAX_REPS_MASTERY;

            tempStats = baseTierPoints + repBonusPoints;

            Stats.STR += currentStatScaling.STR * tempStats;
            Stats.AGI += currentStatScaling.AGI * tempStats;
            Stats.VIT += currentStatScaling.VIT * tempStats;
            Stats.DEX += currentStatScaling.DEX * tempStats;
        }
    });

    Stats.STR = Math.floor(Stats.STR);
    Stats.AGI = Math.floor(Stats.AGI);
    Stats.VIT = Math.floor(Stats.VIT);
    Stats.DEX = Math.floor(Stats.DEX);

    return Stats ;
}