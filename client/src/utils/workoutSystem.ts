import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";
import { exerciseObject } from "../hooks/useWorkoutSession";
import { exerciseProgress } from "../store/usePlayerStore";
import { evaluateRepsOnLowerTier } from "./initialExerciseUnlock";

export function applySessionToProgress(exerciseProgress: Record<string, exerciseProgress>, sessionExercises: Record<string, exerciseObject>) {
  const finalProgress = { ...exerciseProgress };

  Object.entries(sessionExercises || {}).forEach(([exerciseId, ex]) => {
    if (!EXERCISE_DB[exerciseId]) return;
    const { tier: maxTier, category } = EXERCISE_DB[exerciseId];

    
    const highestReps = (ex.sets || []).reduce(
      (max, s) => Math.max(max, Number(s.reps) || 0),
      0
    );

    (ALL_EXERCISES[category] ?? []).forEach((exId) => {
          const prevProgress = finalProgress[exId] || { totalReps: 0, personalBest: 0 };
          const data = EXERCISE_DB[exId];
          if (!data || data.tier > maxTier) return;  // skips anything with higher tier
    
          const estimatedReps = data.tier === maxTier ? ex.totalReps : evaluateRepsOnLowerTier(ex.totalReps, maxTier, data.tier);

          const theRightBest = exId === exerciseId ? Math.max(prevProgress.personalBest, highestReps) : prevProgress.personalBest;

      finalProgress[exId] = {
        totalReps: prevProgress.totalReps + (Number(estimatedReps) || 0),
        personalBest: theRightBest,
      };
  });
  })

  return finalProgress;
}