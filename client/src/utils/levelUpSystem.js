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

function getStandardWeight(userData) {
    return userData.userInfo?.gender === 'female' ? 65 : 80;
}

export function calculateSetXP(exerciseId, set, standardWeight) {
    const exerciseData = EXERCISE_DB[exerciseId];
    if (!exerciseData) return 0;

    const tierReward = TIER_XP_REWARDS[exerciseData.tier];
    if (!Number.isFinite(tierReward)) return 0;
    const baseXP = Math.sqrt(tierReward);

    const reps = Number(set.reps) || 0;
    const extraWeight = Number(set.extraWeight) || 0;
    const setMultiplier = extraWeight > 0 ? 1 + extraWeight / standardWeight : 1;
    return baseXP * reps * setMultiplier;
}

function sumDayXP(day, standardWeight) {
    let dayXP = 0;
    Object.entries(day.exercises || {}).forEach(([exerciseId, ex]) => {
        if (!Array.isArray(ex.sets)) return;
        ex.sets.forEach(set => {
            dayXP += calculateSetXP(exerciseId, set, standardWeight);
        });
    });
    return dayXP;
}

export default function calculateLevel(userData) {
    const workoutHistory = userData.workoutHistory || {};
    const prestige = userData.prestige || 0;
    const prestigeXPConsumed = userData.prestigeXPConsumed || 0;
    const standardWeight = getStandardWeight(userData);

    let totalXP = 0;

    Object.values(workoutHistory).forEach(day => {
        if (day.status !== 'workout') return;
        totalXP += sumDayXP(day, standardWeight);
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

// How much XP a single logged day contributed, grouped by exercise.
export function getXpBreakdown(userData, date) {
    const day = userData.workoutHistory?.[date];
    const breakdown = {};
    if (!day || day.status !== 'workout') return breakdown;

    const standardWeight = getStandardWeight(userData);

    Object.entries(day.exercises || {}).forEach(([exerciseId, ex]) => {
        if (!Array.isArray(ex.sets)) return;
        breakdown[exerciseId] = ex.sets.reduce(
            (sum, set) => sum + calculateSetXP(exerciseId, set, standardWeight),
            0
        );
    });

    return breakdown;
}

// Replays workoutHistory chronologically and reports each day a level threshold was crossed.
// Uses the account's current prestige/prestigeXPConsumed for the whole replay, since past
// prestige counts at each historical date aren't tracked.
export function getLevelUpHistory(userData) {
    const workoutHistory = userData.workoutHistory || {};
    const prestige = userData.prestige || 0;
    const prestigeXPConsumed = userData.prestigeXPConsumed || 0;
    const standardWeight = getStandardWeight(userData);

    const days = Object.entries(workoutHistory)
        .filter(([, day]) => day.status === 'workout')
        .sort(([a], [b]) => new Date(a) - new Date(b));

    let level = 0;
    let xpIntoLevel = -prestigeXPConsumed;
    const history = [];

    days.forEach(([date, day]) => {
        const dayXP = sumDayXP(day, standardWeight);
        xpIntoLevel += dayXP;

        let levelsGained = 0;
        while (level < MAX_LEVEL && xpIntoLevel >= getXpNeededForLevel(level, prestige)) {
            xpIntoLevel -= getXpNeededForLevel(level, prestige);
            level += 1;
            levelsGained += 1;
        }

        if (levelsGained > 0) {
            history.push({ date, level, levelsGained, xpGainedThatDay: dayXP });
        }
    });

    return history;
}