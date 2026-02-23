import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";

// 1. SCALING - Jak moc daný cvik ovlivňuje konkrétní staty
const EXERCISE_STAT_SCALING = {
    pushups: { STR: 1.0, VIT: 0.7, AGI: 0.5, DEX: 0.8 },
    squats:  { STR: 1.0, VIT: 0.9, AGI: 0.8, DEX: 0.5 },
    pullups: { STR: 1.0, VIT: 0.6, AGI: 0.7, DEX: 1.0 },
    core:    { STR: 0.6, VIT: 1.0, AGI: 0.8, DEX: 0.7 }
};

// 2. NASTAVENÍ KŘIVKY A STROPŮ
const BASE_STATS = 10;            // Výchozí hodnota pro úplného nováčka (odpovídá zhruba E-Ranku)
const STATS_MULTIPLIER = 6.5;     // Základní násobič za tier
const TIER_EXPONENT = 1.3;        // Exponenciální růst (čím vyšší číslo, tím víc dají těžší cviky)
const MAX_REPS_MASTERY = 8;       // Kolik extra statů získáš jen za to, že děláš hodně opakování
const MAX_STAT_CAP = 350;         // Absolutní strop (Hard cap) pro jakýkoliv stat - úroveň National

// --- HLAVNÍ VÝPOČET STATŮ ---
export function calculatePlayerStats(userProgress) {
    const Stats = {
        STR: BASE_STATS,
        AGI: BASE_STATS,
        VIT: BASE_STATS,
        DEX: BASE_STATS,
    };

    if (!userProgress) return Stats;

    Object.keys(ALL_EXERCISES).forEach(category => {
        const currentStatScaling = EXERCISE_STAT_SCALING[category];
        if (!currentStatScaling) return;

        let highestTierUnlocked = -1;
        let tempMaxReps = 0;

        // Najdeme nejvyšší odemčený tier v dané kategorii
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

        if (highestTierUnlocked > 0) { // Počítáme od tieru > 0
            // Exponenciální výpočet: Tier^1.3 * Multiplier
            const baseTierPoints = Math.pow(highestTierUnlocked, TIER_EXPONENT) * STATS_MULTIPLIER;
            
            // Bonus za mastery (max 15 opakování dává plný bonus)
            const cappedReps = Math.min(tempMaxReps, 15);
            const repBonusPoints = (cappedReps / 15) * MAX_REPS_MASTERY;

            const totalCategoryPoints = baseTierPoints + repBonusPoints;

            // Rozdělení bodů do statů podle matice
            Stats.STR += currentStatScaling.STR * totalCategoryPoints;
            Stats.AGI += currentStatScaling.AGI * totalCategoryPoints;
            Stats.VIT += currentStatScaling.VIT * totalCategoryPoints;
            Stats.DEX += currentStatScaling.DEX * totalCategoryPoints;
        }
    });

    // Zaokrouhlení a aplikace Hard Capu (žádný stat nemůže přesáhnout MAX_STAT_CAP)
    Stats.STR = Math.min(Math.floor(Stats.STR), MAX_STAT_CAP);
    Stats.AGI = Math.min(Math.floor(Stats.AGI), MAX_STAT_CAP);
    Stats.VIT = Math.min(Math.floor(Stats.VIT), MAX_STAT_CAP);
    Stats.DEX = Math.min(Math.floor(Stats.DEX), MAX_STAT_CAP);

    return Stats;
}