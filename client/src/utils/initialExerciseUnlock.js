import { EXERCISE_DB } from "../data/exercise_db";

const TIER_BASE = 1.35;
const ESTIMATE_REP_CAP = 50;

const estimateReps = (maxReps, fromTier, toTier) => {
  const scaled = Math.round(maxReps * Math.pow(TIER_BASE, fromTier - toTier));
  return Math.min(scaled, ESTIMATE_REP_CAP);
};

export const initialExerciseUnlock = (evaluationResults) => {
  const progress = {};

  Object.values(evaluationResults).forEach(({ variationID, maxReps }) => {
    const achieved = EXERCISE_DB[variationID];
    if (!achieved) return;

    progress[variationID] = {
      totalReps: 0,
      personalBest: Math.max(progress[variationID]?.personalBest ?? 0, maxReps),
    };

    const queue = [...(achieved.prerequisites ?? [])];
    const visited = new Set([variationID]);

    while (queue.length > 0) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);

      const data = EXERCISE_DB[id];
      if (!data) continue;

      const estimated = estimateReps(maxReps, achieved.tier, data.tier);

      progress[id] = {
        totalReps: 0,
        personalBest: Math.max(progress[id]?.personalBest ?? 0, estimated),
      };

      queue.push(...(data.prerequisites ?? []));
    }
  });

  return progress;
};