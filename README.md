# Calisthenics-Ascension

A web-based, RPG-like tracker that combines ranks, leveling up, daily quests, and overall game-like features while focusing on actual, in-real-life progress in Calisthenics. 

The primary goal of this tracker is to ensure that the in-game stats accurately reflect real-world physical progress, provided it receives truthful input from the user.

## Live Demo

www.alexliska.dev (Temporary URL) for testing purposes: username: test, password: test

## Core Mechanics

Unlike traditional RPGs, progression here is strictly tied to real-world calisthenics performance. 

* **Ranks:** Ranks serve as your starting point. The stronger you are at the beginning, the higher your initial rank (with possible re-evaluations later on).
* **Stats:** Stats are currently calculated based on the hardest skill achieved and the number of reps the user can perform. There is a cap of 12 reps, which signals it is time to move on to the next variation.
* **Skill Trees:** Skill trees visually map the progression of exercises and skills (e.g., Australian Pull-ups unlock Jackknife Pull-ups and Isometric Hold Pull-ups).
* **Progression:** Logging reps in advanced exercises cascades down the tree, automatically improving your proficiency score in the prerequisite, easier skills.
* **Leveling:** Levels are calculated based on total reps and exercise difficulty (balancing is currently in progress).

## To-Do List
- [X] Implement weight history tracking. (Now make it one weight per day)
- [ ] Add a meaning to exercising with extra weight.
- [ ] Introduce some kind of points to unlock exercises in the tree.
- [ ] Improve the evaluation window.
- [ ] Completely re-work the core tree.
- [ ] Introduce settings / profile.
- [ ] Include actual video previews.
- [ ] Introduce actual workout split selection. (in settings / profile)
- [ ] Introduce a workout history window.

## Technologies used

**Frontend**
- React (vite)
- Zustand
- MUI X Charts
- React Router 
- React Flow

**Backend**
- Node.js & Express
- Bcrypt
- MongoDB
- Mongoose


## Project Background 

This is a personal project and serves as my introduction to React and React Flow. The development process is heavily "vibe-coded," as learning through building and iterating in this hands-on way saves a significant amount of time.