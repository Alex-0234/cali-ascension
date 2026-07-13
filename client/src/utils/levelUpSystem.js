import { EXERCISE_DB } from "../data/exercise_db";
import { TIER_XP_REWARDS } from "../data/rewardMap";

const MAX_LEVEL = 100;
const BASE_XP_NEEDED = 10;
const XP_PER_LEVEL = BASE_XP_NEEDED * 1.5;
const PRESTIGE_SCALING = 1.25;

export function getXpNeededForLevel(lvl, prestige = 0) {
    const multiplier = Math.pow(PRESTIGE_SCALING, prestige);
    return (BASE_XP_NEEDED + XP_PER_LEVEL * lvl) * multiplier;
}

export function getXpForFullRun(prestige = 0) {
    const levelSum = (MAX_LEVEL * (MAX_LEVEL - 1)) / 2;
    const base = BASE_XP_NEEDED * MAX_LEVEL + XP_PER_LEVEL * levelSum;
    return base * Math.pow(PRESTIGE_SCALING, prestige);
}

export default function calculateLevel(userData) {
    const workoutHistory = userData.workoutHistory || {};
    const prestige = userData.prestige || 0;
    const prestigeXPConsumed = userData.prestigeXPConsumed || 0;

    const standardWeight = userData.userInfo?.gender === 'female' ? 65 : 80;

    let totalXP = 0;

    Object.values(workoutHistory).forEach(day => {
        if (day.status !== 'workout') return;

        Object.entries(day.exercises || {}).forEach(([exerciseId, ex]) => {
            const exerciseData = EXERCISE_DB[exerciseId];
            if (!exerciseData) return;

            const tierReward = TIER_XP_REWARDS[exerciseData.tier];
            if (!Number.isFinite(tierReward)) return;
            const baseXP = Math.sqrt(tierReward);

            if (!Array.isArray(ex.sets)) return;
            ex.sets.forEach(set => {
                const reps = Number(set.reps) || 0;
                const extraWeight = Number(set.extraWeight) || 0;
                const setMultiplier = extraWeight > 0 ? 1 + extraWeight / standardWeight : 1;
                totalXP += baseXP * reps * setMultiplier;
            });
        });
    });

    let currentXP = Math.max(0, totalXP - prestigeXPConsumed);
    let tempLevel = 0;

    while (tempLevel < MAX_LEVEL && currentXP >= getXpNeededForLevel(tempLevel, prestige)) {
        currentXP -= getXpNeededForLevel(tempLevel, prestige);
        tempLevel += 1;
    }

    return {
        level: tempLevel,
        currentLeftoverXP: currentXP,
        totalXPEarned: totalXP,
    };
}

export function getLevelProgress(currentXP, userLevel, prestige = 0) {
    if (userLevel >= MAX_LEVEL) return 100;
    const neededXP = getXpNeededForLevel(userLevel, prestige);
    if (currentXP >= neededXP) return 100;
    return (currentXP / neededXP) * 100;
}

export function canPrestige(userData) {
    return calculateLevel(userData).level >= MAX_LEVEL;
}

export function prestigeUser(userData) {
    const { level } = calculateLevel(userData);
    if (level < MAX_LEVEL) return userData;

    const next = {
        ...userData,
        prestige: (userData.prestige || 0) + 1,
        prestigeXPConsumed:
            (userData.prestigeXPConsumed || 0) + getXpForFullRun(userData.prestige || 0),
    };

    const carried = calculateLevel(next);

    return {
        ...next,
        level: carried.level,
        xp: carried.currentLeftoverXP,
    };
}