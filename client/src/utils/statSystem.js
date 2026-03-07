import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";

const EXERCISE_STAT_SCALING = {
    pushups: { STR: 1.0, END: 0.7, MOB: 0.5, TEC: 0.8 },
    squats:  { STR: 1.0, END: 0.9, MOB: 0.8, TEC: 0.5 },
    pullups: { STR: 1.0, END: 0.6, MOB: 0.7, TEC: 1.0 },
    core:    { STR: 0.6, END: 1.0, MOB: 0.8, TEC: 0.7 }
};

const BASE_STATS = 10;            
const STATS_MULTIPLIER = 6.5;    
const TIER_EXPONENT = 1.3;        
const MAX_REPS_MASTERY = 8;      
const MAX_STAT_CAP = 500;         


export function calculatePlayerStats(userProgress) {
    const Stats = {
        STR: BASE_STATS,
        END: BASE_STATS,
        MOB: BASE_STATS,
        TEC: BASE_STATS,
    };

    if (!userProgress) return Stats;

    Object.keys(ALL_EXERCISES).forEach(category => {
        const currentStatScaling = EXERCISE_STAT_SCALING[category];
        if (!currentStatScaling) return;

        let highestTierUnlocked = -1;
        let tempMaxReps = 0;

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

        if (highestTierUnlocked > 0) { 

            const baseTierPoints = Math.pow(highestTierUnlocked, TIER_EXPONENT) * STATS_MULTIPLIER;
            
            const cappedReps = Math.min(tempMaxReps, 15);
            const repBonusPoints = (cappedReps / 15) * MAX_REPS_MASTERY;

            const totalCategoryPoints = baseTierPoints + repBonusPoints;

            Stats.STR += currentStatScaling.STR * totalCategoryPoints;
            Stats.END += currentStatScaling.END * totalCategoryPoints;
            Stats.MOB += currentStatScaling.MOB * totalCategoryPoints;
            Stats.TEC += currentStatScaling.TEC * totalCategoryPoints;
        }
    });

    Stats.STR = Math.min(Math.floor(Stats.STR), MAX_STAT_CAP);
    Stats.END = Math.min(Math.floor(Stats.END), MAX_STAT_CAP);
    Stats.MOB = Math.min(Math.floor(Stats.MOB), MAX_STAT_CAP);
    Stats.TEC = Math.min(Math.floor(Stats.TEC), MAX_STAT_CAP);

    return Stats;
}