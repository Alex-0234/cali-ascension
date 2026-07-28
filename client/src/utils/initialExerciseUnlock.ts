import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";
import { getUnlockCost } from "./Progression";

interface resultDraftObject {
      variationID: number
      variationName: string
      maxReps: number
}
interface progress {
      totalReps: number
      personalBest: number
}

const TIER_BASE = 1.35;
const ESTIMATE_REP_CAP = 50;
const PREREQ_MIN_REPS = 8;
const PREREQ_MIN_SECONDS = 20;

// TODO - This could be fine for proficiency after workout. Always cascading reps down. 
export const evaluateRepsOnLowerTier = (maxReps: number, maxTier: number, currentTier: number) => {
  const scaled = Math.round(maxReps * Math.pow(TIER_BASE, maxTier - currentTier));
  return Math.min(scaled, ESTIMATE_REP_CAP);
};

export const initialExerciseUnlock = (evaluationResults: Record<string, resultDraftObject>) => {
  const progress: Record<string, progress> = {};
  let bonusEP: number = 0;

  Object.values(evaluationResults).forEach(({ variationID, maxReps }) => {
    const { tier: maxTier, category, unit } = EXERCISE_DB[variationID];

    (ALL_EXERCISES[category] ?? []).forEach((exerciseId) => {
      const data = EXERCISE_DB[exerciseId];
      if (!data || data.tier > maxTier) return;  // skips anything with higher tier

      const estimatedBest = data.tier === maxTier ? maxReps : evaluateRepsOnLowerTier(maxReps, maxTier, data.tier); 

      progress[exerciseId] = {
        totalReps: estimatedBest, // the best is the current total
        personalBest: estimatedBest,
      };
    });

    const directNextCosts = Object.values(EXERCISE_DB)
      .filter((ex) => ex.prerequisites?.includes(String(variationID)))
      .map((ex) => getUnlockCost(ex.id))
      .filter(isFinite);

    if (directNextCosts.length > 0) {
      const minNextCost = Math.min(...directNextCosts);
      const minRequired = unit === "seconds" ? PREREQ_MIN_SECONDS : PREREQ_MIN_REPS;
      const proximity = Math.min(maxReps / minRequired, 1); // caps at 1 — fully ready
      bonusEP += Math.round(minNextCost * proximity);
    }
  });

  return { progress, bonusEP };
};
