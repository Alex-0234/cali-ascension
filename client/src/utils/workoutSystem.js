import { EXERCISE_DB } from "../data/exercise_db";

export function applySessionToProgress(exerciseProgress, sessionExercises) {
  const next = { ...exerciseProgress };

  Object.entries(sessionExercises || {}).forEach(([exerciseId, ex]) => {
    if (!EXERCISE_DB[exerciseId]) return;

    const prev = next[exerciseId] || { totalReps: 0, personalBest: 0 };
    const bestSet = (ex.sets || []).reduce(
      (max, s) => Math.max(max, Number(s.reps) || 0),
      0
    );

    next[exerciseId] = {
      totalReps: prev.totalReps + (Number(ex.totalReps) || 0),
      personalBest: Math.max(prev.personalBest, bestSet),
    };
  });

  return next;
}