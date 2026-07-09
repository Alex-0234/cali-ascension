import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const BASE_STATS = 10;
const MAX_STAT_CAP = 1000;
const CONTRIBUTION_SCALE = 40;

// Tier now runs 0 (rehab) to 11 (one-arm pull-up), so weight by tier directly
// (no more tier-1). tier 0 -> weight 1, tier 11 -> ~26.5. Adjust the base
// (1.35) to make harder variations matter more or less.
function tierWeight(tier) {
  return Math.pow(1.35, tier ?? 0);
}

// ---------------------------------------------------------------------------
// REP-BASED CURVES (unit === "reps")
// Smooth triangular weighting instead of hard buckets.
// ---------------------------------------------------------------------------
const REP_PROFILES = {
  STR: { peak: 2, spread: 6 },
  HYP: { peak: 8, spread: 8 },
  END: { peak: 20, spread: 14 },
};

// ---------------------------------------------------------------------------
// HOLD-BASED CURVES (unit === "seconds") — L-sit, front lever, plank, etc.
// A short near-max hold behaves like a low-rep strength set; a long hold
// behaves like an endurance set. Holds don't map to HYP the way reps do,
// so isometrics only contribute to STR and END.
// ---------------------------------------------------------------------------
const HOLD_PROFILES = {
  STR: { peak: 8, spread: 15 },   // ~8s hold at a hard skill = near-max effort
  END: { peak: 45, spread: 40 },  // long holds = static endurance
};

function triangleWeight(value, peak, spread) {
  const distance = Math.abs(value - peak);
  return Math.max(0, 1 - distance / spread);
}

function scoresForSet(unit, amount) {
  if (unit === "seconds") {
    return {
      STR: triangleWeight(amount, HOLD_PROFILES.STR.peak, HOLD_PROFILES.STR.spread),
      HYP: 0,
      END: triangleWeight(amount, HOLD_PROFILES.END.peak, HOLD_PROFILES.END.spread),
    };
  }
  // default: reps
  return {
    STR: triangleWeight(amount, REP_PROFILES.STR.peak, REP_PROFILES.STR.spread),
    HYP: triangleWeight(amount, REP_PROFILES.HYP.peak, REP_PROFILES.HYP.spread),
    END: triangleWeight(amount, REP_PROFILES.END.peak, REP_PROFILES.END.spread),
  };
}

// ---------------------------------------------------------------------------
// RECENCY DECAY — reflects current capability, not lifetime history.
// ---------------------------------------------------------------------------
const RECENCY_FULL_DAYS = 21;
const RECENCY_FADE_DAYS = 90;
const RECENCY_FLOOR = 0.35;

function recencyMultiplier(daysAgo) {
  if (daysAgo <= RECENCY_FULL_DAYS) return 1;
  if (daysAgo >= RECENCY_FULL_DAYS + RECENCY_FADE_DAYS) return RECENCY_FLOOR;
  const t = (daysAgo - RECENCY_FULL_DAYS) / RECENCY_FADE_DAYS;
  return 1 - t * (1 - RECENCY_FLOOR);
}

function daysBetween(dateStr, today) {
  return Math.floor((today - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// MAIN CALCULATION
// ---------------------------------------------------------------------------
export function calculatePlayerStats(userData, userProgress) {
  const raw = { STR: 0, HYP: 0, END: 0, POW: 0 };

  if (!userData?.workoutHistory || !userProgress) {
    return { STR: BASE_STATS, HYP: BASE_STATS, END: BASE_STATS, POW: BASE_STATS };
  }

  const today = new Date();

  Object.keys(ALL_EXERCISES).forEach((category) => {
    ALL_EXERCISES[category].forEach((exerciseId) => {
      const exerciseData = EXERCISE_DB[exerciseId];
      if (!exerciseData || !userProgress[exerciseId]) return;

      const tw = tierWeight(exerciseData.tier);
      const isPowerBranch = exerciseData.isExplosive === true;

      // Best recent set per exercise, per stat — your level is your best
      // current performance on a movement, not the sum of every rep ever done.
      const best = { STR: 0, HYP: 0, END: 0, POW: 0 };

      Object.entries(userData.workoutHistory).forEach(([date, day]) => {
        const exHistory = day.exercises?.[exerciseId];
        if (!exHistory) return;

        const recency = recencyMultiplier(daysBetween(date, today));

        Object.values(exHistory.sets).forEach((set) => {
          // "reps" field is used for both unit types in your history shape —
          // if you store hold duration under a different key (e.g. set.seconds),
          // swap this line accordingly.
          const amount = set.reps;
          const scores = scoresForSet(exerciseData.unit, amount);

          best.STR = Math.max(best.STR, scores.STR * tw * recency);
          best.HYP = Math.max(best.HYP, scores.HYP * tw * recency);
          best.END = Math.max(best.END, scores.END * tw * recency);

          // POW comes from branch:"power" exercises, weighted by tier/recency
          // directly rather than through a rep curve — for explosive work,
          // performing the movement at all (at a given difficulty) is what
          // counts, not landing on a specific rep count.
          if (isPowerBranch) {
            best.POW = Math.max(best.POW, tw * recency);
          }
        });
      });

      raw.STR += best.STR;
      raw.HYP += best.HYP;
      raw.END += best.END;
      raw.POW += best.POW;
    });
  });

  const compress = (x) => Math.sqrt(x) * CONTRIBUTION_SCALE;

  const Stats = {
    STR: BASE_STATS + compress(raw.STR),
    HYP: BASE_STATS + compress(raw.HYP),
    END: BASE_STATS + compress(raw.END),
    POW: BASE_STATS + compress(raw.POW),
  };

  Object.keys(Stats).forEach((k) => {
    Stats[k] = Math.min(Math.floor(Stats[k]), MAX_STAT_CAP);
  });

  return Stats;
}