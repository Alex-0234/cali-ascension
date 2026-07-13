import { EXERCISE_DB } from "../data/exercise_db";

const TIER_BASE = 1.35;
const MAX_TIER = 11;

function tierFactor(tier = 0) {
  return Math.pow(TIER_BASE, tier - MAX_TIER);
}

function setScore(exerciseId, reps) {
  const data = EXERCISE_DB[exerciseId];
  if (!data || !(reps > 0)) return 0;
  const sat = data.unit === "seconds" ? 30 : 10;
  return tierFactor(data.tier) * (0.5 + 0.5 * Math.min(reps / sat, 1));
}

const RATING_FLOOR = 0;
const RATING_SCALE = 400;
const K_FACTOR = 32;
const DIFFICULTY_RATING_CEIL = 5000;
const FULL_VOLUME_SETS = 10;

export function calculateWorkoutRating(workoutExercises) {
  let hardestSet = 0;
  let volume = 0;

  Object.entries(workoutExercises).forEach(([exerciseId, ex]) => {
    Object.values(ex.sets ?? {}).forEach((set) => {
      const score = setScore(exerciseId, set.reps);
      hardestSet = Math.max(hardestSet, score);
      volume += score;
    });
  });

  if (hardestSet === 0) return 0;

  const volumeFactor = Math.min(volume / (hardestSet * FULL_VOLUME_SETS), 1);
  return Math.round(DIFFICULTY_RATING_CEIL * hardestSet * (0.6 + 0.4 * volumeFactor));
}

// completion: 0..1, fraction of the planned workout actually finished.
export function updateRating(currentRating, workoutRating, completion = 1) {
  const expected = 1 / (1 + Math.pow(10, (workoutRating - currentRating) / RATING_SCALE));
  const next = currentRating + K_FACTOR * (completion - expected);
  return Math.max(RATING_FLOOR, Math.round(next));
}

const EP_SCALE = 15;
const SET_DECAY = 0.8;
const UNLOCK_BASE_COST = 20;
const PREREQ_MIN_REPS = 8;
const PREREQ_MIN_SECONDS = 20;

export function calculateWorkoutEP(workoutExercises) {
  let ep = 0;

  Object.entries(workoutExercises).forEach(([exerciseId, ex]) => {
    Object.values(ex.sets ?? {}).forEach((set, i) => {
      ep += setScore(exerciseId, set.reps) * EP_SCALE * Math.pow(SET_DECAY, i);
    });
  });

  return Math.ceil(ep);
}

export function getUnlockCost(exerciseId) {
  const data = EXERCISE_DB[exerciseId];
  if (!data) return Infinity;
  return Math.round(UNLOCK_BASE_COST * Math.pow(TIER_BASE, data.tier));
}

export function canUnlockExercise(exerciseId, exerciseProgress) {
  const data = EXERCISE_DB[exerciseId];
  if (!data) return { ok: false, reason: "Unknown exercise" };
  if (exerciseProgress[exerciseId]) return { ok: false, reason: "Already unlocked" };

  const prereqs = data.prerequisites ?? [];

  const locked = prereqs.filter((id) => !exerciseProgress[id]);
  if (locked.length > 0) {
    return { ok: false, reason: "Prerequisites locked", exercises: locked };
  }

  const weak = prereqs.filter((id) => {
    const minPB = EXERCISE_DB[id]?.unit === "seconds" ? PREREQ_MIN_SECONDS : PREREQ_MIN_REPS;
    return (exerciseProgress[id]?.personalBest ?? 0) < minPB;
  });
  if (weak.length > 0) {
    return { ok: false, reason: "Prerequisite proficiency too low", exercises: weak };
  }

  return { ok: true, cost: getUnlockCost(exerciseId) };
}

// Pure: returns { ep, exerciseProgress } on success, null on failure.
export function unlockExercise(exerciseId, currentEP, exerciseProgress) {
  const check = canUnlockExercise(exerciseId, exerciseProgress);
  if (!check.ok || currentEP < check.cost) return null;

  return {
    ep: currentEP - check.cost,
    exerciseProgress: {
      ...exerciseProgress,
      [exerciseId]: { totalReps: 0, personalBest: 0 },
    },
  };
}