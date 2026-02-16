
import { EXERCISE_DB } from "../data/exercise_db";
import { TIER_XP_REWARDS } from "../data/rewardMap";

export function getXpNeededForLevel(lvl) {
    const BASE_XP_NEEDED = 10;
    const output = BASE_XP_NEEDED + ((BASE_XP_NEEDED * 1.5) * lvl);
    return output;
}

export default function calculateLevelUp(currentLevel, currentLeftoverXP, variationID, totalReps) {

    const exerciseTier = EXERCISE_DB[variationID].tier;
    const gainedXP = (TIER_XP_REWARDS[exerciseTier] * totalReps);

    let tempLevel = currentLevel;
    let levelUps = 0;
    let currentXP = gainedXP + currentLeftoverXP;

    while (currentXP >= getXpNeededForLevel(tempLevel)) {
        currentXP -= getXpNeededForLevel(tempLevel);

        tempLevel += 1;
        levelUps += 1;
    }
    return {
        newLevel: currentLevel + levelUps,
        leftoverXP: currentXP
    }
    
}