# Cali Ascension

A calisthenics progression tracker built around one idea: your in-game stats should actually mean something. Level up, unlock exercises, and watch your numbers climb — but only because you got stronger in real life.

## Live Demo

[cali-ascension.vercel.app](https://cali-ascension.vercel.app)

- Username: `test` / Password: `test`

> The backend runs on a free Render instance and may take ~30 seconds to wake up on first load.

---

## What makes it different

Most fitness apps gamify the act of showing up. Log a workout, get points. Cali Ascension tries to gamify the actual difficulty of what you're doing.

Stats are derived from your exercise history using tier weighting, rep counts, set volume, and recency decay. Grinding easy exercises indefinitely won't inflate your numbers — the system rewards moving up the skill tree.

There are no random quest popups or daily challenges nudging you to do things for the sake of engagement. The only progression that matters is the one you earn under the bar.

---

## Stats

Six attributes, all calculated from real workout data:

| Stat | What it measures |
|------|-----------------|
| **STR** Strength | Peak difficulty × reps achieved. Tier matters most here. |
| **HYP** Hypertrophy | Volume in the 6–12 rep range across all categories. |
| **END** Endurance | High-rep and long-hold performance. Tier matters less. |
| **POW** Power | Explosive movements primarily, with a bleed-in from heavy strength work. |
| **BAL** Balance | How evenly your training is distributed across all movement categories. A pull-up specialist with zero leg work will see this reflect that. |
| **AP** Adaptive Potential | Based on the Acute:Chronic Workload Ratio. Tells you if your current training load is in the range where the body adapts — or if you're spiking too hard and need a rest day. |

Stats range from 10 to 1000 and decay gradually if you stop training. Old workouts still contribute, just at a lower weight.

---

## Exercise System

**170+ exercises** across six categories: Push-ups, Pull-ups, Squats, Dips, Core, and Bridges.

Each exercise has a tier (1–11) and belongs to a branch within its category — standard progressions, asymmetric work, power/explosive paths, isometric holds, planche lines, and more. Exercises unlock through a prerequisite skill tree: you need to demonstrate a baseline at each step before moving forward.

Unlocking costs **Evolution Points (EP)**, earned by training. Harder sets earn more. There's diminishing return per set in a single session so you can't grind one exercise endlessly.

---

## Calibration

New users go through an initial evaluation that finds your starting tier in each category, unlocks everything below it automatically, and awards bonus EP based on how close you are to the next progression. The harder you can go on day one, the more head start you get.

---

## Progression

- **Level** reflects cumulative XP weighted by exercise difficulty
- **Elo-style Rating** tracks workout consistency and challenge — beating a workout above your level pushes it up, skipping easy ones doesn't
- **Prestige** resets XP at level 100 with a multiplier carried forward
- **Proficiency** per exercise tracks long-term volume, separate from stats

---

## Tech Stack

**Frontend** — React (Vite), Zustand, Tailwind CSS

**Backend** — Node.js, Express, MongoDB, Mongoose, bcrypt

---

## Background

Personal project, started as an introduction to React. The design philosophy is to build first and iterate — so the codebase reflects that. It works, it tracks real progress, and it's honest about what the numbers mean.
