import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";
import { getUnlockCost } from "./Progression";

const TIER_BASE = 1.35;
const ESTIMATE_REP_CAP = 50;
const PREREQ_MIN_REPS = 8;
const PREREQ_MIN_SECONDS = 20;

const estimateReps = (maxReps, fromTier, toTier) => {
  const scaled = Math.round(maxReps * Math.pow(TIER_BASE, fromTier - toTier));
  return Math.min(scaled, ESTIMATE_REP_CAP);
};

export const initialExerciseUnlock = (evaluationResults) => {
  const progress = {};
  let bonusEP = 0;

  Object.values(evaluationResults).forEach(({ variationID, maxReps }) => {
    const achieved = EXERCISE_DB[variationID];
    if (!achieved) return;

    const { tier: maxTier, category } = achieved;

    // Unlock every exercise in this category at or below the achieved tier.
    // Estimate personal bests for easier exercises using tier scaling.
    (ALL_EXERCISES[category] ?? []).forEach((id) => {
      const data = EXERCISE_DB[id];
      if (!data || data.tier > maxTier) return;

      const estimated = data.tier === maxTier
        ? maxReps
        : estimateReps(maxReps, maxTier, data.tier);

      progress[id] = {
        totalReps: 0,
        personalBest: Math.max(progress[id]?.personalBest ?? 0, estimated),
      };
    });

    // Bonus EP: how close is the user to unlocking the next tier?
    // Find all exercises that directly follow this one (have it as a prerequisite),
    // take the cheapest as the reference, and award that cost × proximity fraction.
    const directNextCosts = Object.values(EXERCISE_DB)
      .filter((ex) => ex.prerequisites?.includes(variationID))
      .map((ex) => getUnlockCost(ex.id))
      .filter(isFinite);

    if (directNextCosts.length > 0) {
      const minNextCost = Math.min(...directNextCosts);
      const minRequired = achieved.unit === "seconds" ? PREREQ_MIN_SECONDS : PREREQ_MIN_REPS;
      const proximity = Math.min(maxReps / minRequired, 1); // caps at 1 — fully ready
      bonusEP += Math.round(minNextCost * proximity);
    }
  });

  return { progress, bonusEP };
};
