import { EXERCISE_DB, ALL_EXERCISES } from "../data/exercise_db";

const STAT_FLOOR = 10;
const STAT_CEIL = 1000;
const MAX_TIER = 11;
const TIER_BASE = 1.35;

const TIER_EXPONENT = { STR: 1, HYP: 0.75, END: 0.5, POW: 1 };

const MOD_MULTIPLIERS = { incline: 0.75, decline: 1.25, band: 0.70 };

// Non-explosive sets bleed into POW at this fraction.
// Rationale: high strength directly implies some power capacity.
const POW_SPILLOVER = 0.35;

// Average daily training load that represents consistent intermediate training.
// Used to normalize the AP chronic factor. Tunable.
const AP_REF_CHRONIC = 0.3;

function getModMultiplier(mods = []) {
  return mods.reduce((acc, m) => acc * (MOD_MULTIPLIERS[m] ?? 1), 1);
}

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
      push(id, { amount: p.personalBest, extraWeight: 0, modMultiplier: 1, isExplosive: false, recency: 1 });
    }
  });

  Object.entries(userData.workoutHistory || {}).forEach(([date, day]) => {
    if (day?.status !== "workout") return;
    const recency = recencyMultiplier(daysBetween(date, today));

    Object.entries(day.exercises || {}).forEach(([id, ex]) => {
      (Array.isArray(ex.sets) ? ex.sets : []).forEach((set) => {
        const amount = Number(set.reps) || 0;
        if (amount <= 0) return;
        const mods = set.modifiers || [];
        push(id, {
          amount,
          extraWeight: Number(set.extraWeight) || 0,
          modMultiplier: getModMultiplier(mods),
          isExplosive: mods.includes("explosive"),
          recency,
        });
      });
    });
  });

  return observations;
}

// Sums raw training load for a single workout day.
// Used by AP only — not the same as observation scores.
function collectDailyLoads(userData, bodyWeight, today) {
  const dailyLoads = {};

  Object.entries(userData.workoutHistory || {}).forEach(([date, day]) => {
    if (day?.status !== "workout") return;
    const daysAgo = daysBetween(date, today);
    if (daysAgo > 35) return;

    let load = 0;
    Object.entries(day.exercises || {}).forEach(([id, ex]) => {
      const data = EXERCISE_DB[id];
      if (!data) return;
      (Array.isArray(ex.sets) ? ex.sets : []).forEach((set) => {
        const amount = Number(set.reps) || 0;
        if (amount <= 0) return;
        const mods = set.modifiers || [];
        const reps = repFactors(amount, data.unit);
        const extraWeight = Number(set.extraWeight) || 0;
        const loadFactor = 1 + extraWeight / bodyWeight;
        load += tierFactor(data.tier, 1) * reps.STR * loadFactor * getModMultiplier(mods);
      });
    });

    dailyLoads[daysAgo] = (dailyLoads[daysAgo] || 0) + load;
  });

  return dailyLoads;
}

// AP uses the Acute:Chronic Workload Ratio (ACWR) from exercise science.
//   Acute  = avg daily load over last 7 days
//   Chronic = avg daily load over last 28 days
//   ACWR sweet spot: 0.8–1.3 → body is adapting
//   Below 0.8 → insufficient stimulus (detraining)
//   Above 1.5 → spike in load, overreaching risk
function calculateAP(userData, bodyWeight, today) {
  const dailyLoads = collectDailyLoads(userData, bodyWeight, today);

  let acuteSum = 0;
  for (let d = 0; d <= 6; d++) acuteSum += dailyLoads[d] || 0;
  const acuteLoad = acuteSum / 7;

  let chronicSum = 0;
  for (let d = 0; d <= 27; d++) chronicSum += dailyLoads[d] || 0;
  const chronicLoad = chronicSum / 28;

  // If no chronic base yet but already training acutely, treat as a spike
  const ACWR = chronicLoad > 0 ? acuteLoad / chronicLoad : acuteLoad > 0 ? 2.0 : 0;

  // Maps ACWR to a 0–1 quality score. Peaks in the 0.8–1.3 sweet spot.
  let acwrScore;
  if      (ACWR <= 0)        acwrScore = 0;
  else if (ACWR <  0.5)      acwrScore = (ACWR / 0.5) * 0.3;
  else if (ACWR <  0.8)      acwrScore = 0.3 + ((ACWR - 0.5) / 0.3) * 0.7;
  else if (ACWR <= 1.3)      acwrScore = 1.0;
  else if (ACWR <  1.8)      acwrScore = 1.0 - ((ACWR - 1.3) / 0.5) * 0.8;
  else                       acwrScore = 0.2;

  // Chronic factor: AP is low if there's barely any training history, regardless of ACWR
  const chronicFactor = Math.min(1, chronicLoad / AP_REF_CHRONIC);

  const apRaw = chronicFactor * acwrScore;
  const value = Math.min(STAT_CEIL, Math.floor(STAT_FLOOR + (STAT_CEIL - STAT_FLOOR) * apRaw));

  let state = "adapting";
  if      (ACWR > 1.5)                              state = "overreaching";
  else if (chronicLoad < AP_REF_CHRONIC * 0.2)      state = "detraining";

  return { value, state };
}

export function calculatePlayerStats(userData) {
  const today = new Date();
  const observations = collectObservations(userData, today);
  const bodyWeight =
    Number(userData.userInfo?.weight) ||
    (userData.userInfo?.gender === "female" ? 65 : 80);

  const categories = Object.keys(ALL_EXERCISES);
  const totals = { STR: 0, HYP: 0, END: 0, POW: 0 };
  const categoryScores = []; // combined score per category, used for BAL

  categories.forEach((category) => {
    const best = { STR: 0, HYP: 0, END: 0, POW: 0 };

    ALL_EXERCISES[category].forEach((exerciseId) => {
      const data = EXERCISE_DB[exerciseId];
      if (!data) return;

      (observations[exerciseId] || []).forEach((obs) => {
        const reps = repFactors(obs.amount, data.unit);
        const load = 1 + obs.extraWeight / bodyWeight;

        const score = (stat, repFactor) =>
          Math.min(1, tierFactor(data.tier, TIER_EXPONENT[stat]) * repFactor * load * obs.modMultiplier) *
          obs.recency;

        best.STR = Math.max(best.STR, score("STR", reps.STR));
        best.HYP = Math.max(best.HYP, score("HYP", reps.HYP));
        best.END = Math.max(best.END, score("END", reps.END));

        // Explosive sets get full POW credit.
        // Non-explosive sets bleed in at POW_SPILLOVER — being strong implies power potential.
        const powScore = (data.isExplosive || obs.isExplosive)
          ? score("POW", reps.STR)
          : score("POW", reps.STR) * POW_SPILLOVER;
        best.POW = Math.max(best.POW, powScore);
      });
    });

    totals.STR += best.STR;
    totals.HYP += best.HYP;
    totals.END += best.END;
    totals.POW += best.POW;

    // BAL uses a weighted combined score: STR-dominant since it best reflects overall training level
    categoryScores.push(best.STR * 0.5 + best.HYP * 0.25 + best.END * 0.25);
  });

  const n = categories.length || 1;

  // BAL: measures both level and evenness across categories.
  // Coefficient of variation (cv = stddev/mean) captures the spread — cv=0 is perfect balance.
  // balRaw = mean × evenness, so both must be high to score well.
  const catMean = categoryScores.reduce((a, b) => a + b, 0) / n;
  const catVariance = categoryScores.reduce((acc, s) => acc + (s - catMean) ** 2, 0) / n;
  const cv = catMean > 0 ? Math.sqrt(catVariance) / catMean : 1;
  const evenness = Math.max(0, 1 - Math.min(cv, 1.5) / 1.5);
  const balRaw = catMean * evenness;

  const scale = (sum, divisor) =>
    Math.min(
      STAT_CEIL,
      Math.floor(STAT_FLOOR + (STAT_CEIL - STAT_FLOOR) * (sum / divisor))
    );

  const ap = calculateAP(userData, bodyWeight, today);

  return {
    STR: scale(totals.STR, n),
    HYP: scale(totals.HYP, n),
    END: scale(totals.END, n),
    POW: scale(totals.POW, n),
    BAL: Math.min(STAT_CEIL, Math.floor(STAT_FLOOR + (STAT_CEIL - STAT_FLOOR) * balRaw)),
    AP:  ap.value,
    apState: ap.state, // "adapting" | "detraining" | "overreaching"
  };
}
