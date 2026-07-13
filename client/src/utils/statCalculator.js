import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";

const STAT_FLOOR = 10;
const STAT_CEIL = 1000;
const MAX_TIER = 11;
const TIER_BASE = 1.35;

const TIER_EXPONENT = { STR: 1, HYP: 0.75, END: 0.5, POW: 1 };

const RECENCY_FULL_DAYS = 21;
const RECENCY_FADE_DAYS = 90;
const RECENCY_FLOOR = 0.35;

function tierFactor(tier = 0, exponent = 1) {
  return Math.pow(TIER_BASE, exponent * (tier - MAX_TIER));
}

function repFactors(amount, unit) {
  if (unit === "seconds") {
    return {
      STR: 0.6 + 0.4 * Math.min(amount / 10, 1),
      HYP: 0,
      END: Math.min(amount / 60, 1),
    };
  }
  return {
    STR: 0.6 + 0.4 * Math.min(amount / 5, 1),
    HYP: Math.min(amount / 12, 1),
    END: Math.min(amount / 30, 1),
  };
}

function recencyMultiplier(daysAgo) {
  if (daysAgo <= RECENCY_FULL_DAYS) return 1;
  if (daysAgo >= RECENCY_FULL_DAYS + RECENCY_FADE_DAYS) return RECENCY_FLOOR;
  const t = (daysAgo - RECENCY_FULL_DAYS) / RECENCY_FADE_DAYS;
  return 1 - t * (1 - RECENCY_FLOOR);
}

function daysBetween(dateStr, today) {
  return Math.max(0, Math.floor((today - new Date(dateStr)) / 86400000));
}

function collectObservations(userData, today) {
  const observations = {};
  const push = (id, obs) => {
    (observations[id] ??= []).push(obs);
  };

  Object.entries(userData.exerciseProgress || {}).forEach(([id, p]) => {
    if (p?.personalBest > 0) {
      push(id, { amount: p.personalBest, extraWeight: 0, recency: 1 });
    }
  });

  Object.entries(userData.workoutHistory || {}).forEach(([date, day]) => {
    if (day?.status !== "workout") return;
    const recency = recencyMultiplier(daysBetween(date, today));

    Object.entries(day.exercises || {}).forEach(([id, ex]) => {
      (Array.isArray(ex.sets) ? ex.sets : []).forEach((set) => {
        const amount = Number(set.reps) || 0;
        if (amount <= 0) return;
        push(id, {
          amount,
          extraWeight: Number(set.extraWeight) || 0,
          recency,
        });
      });
    });
  });

  return observations;
}

export function calculatePlayerStats(userData) {
  const today = new Date();
  const observations = collectObservations(userData, today);
  const bodyWeight =
    Number(userData.userInfo?.weight) ||
    (userData.userInfo?.gender === "female" ? 65 : 80);

  const categories = Object.keys(ALL_EXERCISES);
  const totals = { STR: 0, HYP: 0, END: 0, POW: 0 };
  let powCategories = 0;

  categories.forEach((category) => {
    const best = { STR: 0, HYP: 0, END: 0, POW: 0 };
    let categoryHasExplosive = false;

    ALL_EXERCISES[category].forEach((exerciseId) => {
      const data = EXERCISE_DB[exerciseId];
      if (!data) return;
      if (data.isExplosive) categoryHasExplosive = true;

      (observations[exerciseId] || []).forEach((obs) => {
        const reps = repFactors(obs.amount, data.unit);
        const load = 1 + obs.extraWeight / bodyWeight;

        const score = (stat, repFactor) =>
          Math.min(1, tierFactor(data.tier, TIER_EXPONENT[stat]) * repFactor * load) *
          obs.recency;

        best.STR = Math.max(best.STR, score("STR", reps.STR));
        best.HYP = Math.max(best.HYP, score("HYP", reps.HYP));
        best.END = Math.max(best.END, score("END", reps.END));

        if (data.isExplosive) {
          best.POW = Math.max(best.POW, score("POW", reps.STR));
        }
      });
    });

    totals.STR += best.STR;
    totals.HYP += best.HYP;
    totals.END += best.END;
    if (categoryHasExplosive) {
      totals.POW += best.POW;
      powCategories += 1;
    }
  });

  const n = categories.length || 1;
  const scale = (sum, divisor) =>
    Math.min(
      STAT_CEIL,
      Math.floor(STAT_FLOOR + (STAT_CEIL - STAT_FLOOR) * (sum / divisor))
    );

  return {
    STR: scale(totals.STR, n),
    HYP: scale(totals.HYP, n),
    END: scale(totals.END, n),
    POW: scale(totals.POW, powCategories || 1),
  };
}